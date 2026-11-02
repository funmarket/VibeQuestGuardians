import { Pool, type PoolClient } from 'pg';

import type { DatabaseConfig } from './config.js';

export interface PostgisEvidence {
  available: boolean;
  version: string;
}

export function createDatabasePool(config: DatabaseConfig): Pool {
  return new Pool({
    connectionString: config.connectionString,
    connectionTimeoutMillis: config.connectTimeoutMs,
    max: 4,
    idleTimeoutMillis: 5_000,
  });
}

export async function verifyDatabaseConnection(
  client: PoolClient,
  expectedTarget: string,
): Promise<void> {
  const result = await client.query<{ database_name: string }>(
    'SELECT current_database() AS database_name',
  );
  if (result.rows[0]?.database_name !== expectedTarget) {
    throw new Error('Connected database does not match the approved target');
  }
}

export async function verifyPostgis(
  client: PoolClient,
): Promise<PostgisEvidence> {
  const result = await client.query<{ version: string | null }>(
    `SELECT extversion AS version
       FROM pg_extension
      WHERE extname = 'postgis'`,
  );
  const version = result.rows[0]?.version ?? '';
  if (!version) {
    throw new Error('Required PostGIS extension is unavailable');
  }
  return { available: true, version };
}
