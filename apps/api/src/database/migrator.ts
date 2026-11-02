import { createHash } from 'node:crypto';

import type { PoolClient } from 'pg';

import {
  createDatabasePool,
  verifyDatabaseConnection,
  verifyPostgis,
  type PostgisEvidence,
} from './adapter.js';
import type { DatabaseConfig } from './config.js';

const ledgerTable = 'vq_platform_migration_ledger';
const lockKey = 'vibequest:s01-4:migration-authority';

export interface MigrationDefinition {
  version: string;
  sql: string;
}

export interface MigrationLedgerEntry {
  version: string;
  checksum: string;
  outcome: 'applied';
  executedAt: string;
  executionOrder: string;
  target: string;
}

export interface MigrationResult {
  postgis: PostgisEvidence;
  ledger: MigrationLedgerEntry[];
}

export const defaultMigrations: MigrationDefinition[] = [
  {
    version: '0001_postgis_extension',
    sql: 'CREATE EXTENSION IF NOT EXISTS postgis',
  },
];

function checksum(sql: string): string {
  return createHash('sha256').update(sql).digest('hex');
}

function validateMigrations(migrations: MigrationDefinition[]): void {
  const versions = migrations.map((migration) => migration.version);
  if (new Set(versions).size !== versions.length) {
    throw new Error('Migration versions must be unique');
  }
  const sorted = [...versions].sort();
  if (versions.some((version, index) => version !== sorted[index])) {
    throw new Error('Migration versions must be supplied in order');
  }
}

async function ensureLedger(client: PoolClient): Promise<void> {
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${ledgerTable} (
      version text PRIMARY KEY,
      checksum text NOT NULL,
      outcome text NOT NULL CHECK (outcome = 'applied'),
      executed_at timestamptz NOT NULL DEFAULT now(),
      execution_order bigint GENERATED ALWAYS AS IDENTITY,
      target text NOT NULL
    )
  `);
}

async function readLedger(client: PoolClient): Promise<MigrationLedgerEntry[]> {
  const result = await client.query<MigrationLedgerEntry>(
    `SELECT version, checksum, outcome, executed_at AS "executedAt",
            execution_order AS "executionOrder", target
       FROM ${ledgerTable}
      ORDER BY execution_order`,
  );
  return result.rows;
}

export async function verifyMigrationReadiness(
  config: DatabaseConfig,
): Promise<void> {
  const pool = createDatabasePool(config);
  let client: PoolClient | undefined;
  try {
    client = await pool.connect();
    await verifyDatabaseConnection(client, config.target);
    await verifyPostgis(client);
    const result = await client.query<{ version: string }>(
      `SELECT version
         FROM ${ledgerTable}
        WHERE version = $1
          AND outcome = 'applied'`,
      [defaultMigrations[0].version],
    );
    if (!result.rows[0]) {
      throw new Error('Required staging migration is not installed');
    }
  } finally {
    client?.release();
    await pool.end();
  }
}

async function applyMigration(
  client: PoolClient,
  migration: MigrationDefinition,
  config: DatabaseConfig,
): Promise<void> {
  await client.query('BEGIN');
  try {
    await client.query(migration.sql);
    await client.query(
      `INSERT INTO ${ledgerTable} (version, checksum, outcome, target)
       VALUES ($1, $2, 'applied', $3)`,
      [migration.version, checksum(migration.sql), config.target],
    );
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
}

export async function runMigrations(
  config: DatabaseConfig,
  migrations: MigrationDefinition[] = defaultMigrations,
): Promise<MigrationResult> {
  validateMigrations(migrations);
  const pool = createDatabasePool(config);
  let client: PoolClient | undefined;
  let locked = false;
  try {
    client = await pool.connect();
    await verifyDatabaseConnection(client, config.target);
    await client.query('SELECT pg_advisory_lock(hashtextextended($1, 0))', [
      lockKey,
    ]);
    locked = true;
    await ensureLedger(client);

    const installed = await readLedger(client);
    const installedByVersion = new Map(
      installed.map((entry) => [entry.version, entry]),
    );
    const highestInstalledVersion = [...installedByVersion.keys()]
      .sort()
      .at(-1);
    for (const migration of migrations) {
      const existing = installedByVersion.get(migration.version);
      if (existing && existing.checksum !== checksum(migration.sql)) {
        throw new Error(`Migration checksum mismatch for ${migration.version}`);
      }
      if (
        !existing &&
        highestInstalledVersion &&
        migration.version < highestInstalledVersion
      ) {
        throw new Error(
          `Migration ${migration.version} is out of order after ${highestInstalledVersion}`,
        );
      }
    }

    for (const migration of migrations) {
      if (!installedByVersion.has(migration.version)) {
        await applyMigration(client, migration, config);
      }
    }

    const postgis = await verifyPostgis(client);
    return { postgis, ledger: await readLedger(client) };
  } finally {
    if (locked && client) {
      try {
        await client.query(
          'SELECT pg_advisory_unlock(hashtextextended($1, 0))',
          [lockKey],
        );
      } finally {
        client.release();
      }
    } else {
      client?.release();
    }
    await pool.end();
  }
}
