import assert from 'node:assert/strict';
import test from 'node:test';

import {
  parseDatabaseConfig,
  type DatabaseConfig,
} from '../../../apps/api/src/database/config.js';
import {
  runMigrations,
  type MigrationDefinition,
} from '../../../apps/api/src/database/migrator.js';

const databaseUrl = process.env.VQ_TEST_DATABASE_URL;
const databaseTarget = process.env.VQ_TEST_DATABASE_TARGET;
const noPostgisDatabaseUrl = process.env.VQ_TEST_DATABASE_NO_POSTGIS_URL;
const noPostgisDatabaseTarget = process.env.VQ_TEST_DATABASE_NO_POSTGIS_TARGET;

function requireIntegrationConfig(): DatabaseConfig {
  assert.ok(databaseUrl, 'VQ_TEST_DATABASE_URL is required');
  assert.ok(databaseTarget, 'VQ_TEST_DATABASE_TARGET is required');
  return parseDatabaseConfig({
    VQ_DATABASE_URL: databaseUrl,
    VQ_DATABASE_TARGET: databaseTarget,
    VQ_DATABASE_APPROVED_TARGET: databaseTarget,
  });
}

test('database configuration rejects an unapproved target', () => {
  assert.throws(
    () =>
      parseDatabaseConfig({
        VQ_DATABASE_URL: 'postgres://redacted@127.0.0.1:5432/vq_test',
        VQ_DATABASE_TARGET: 'local-test',
        VQ_DATABASE_APPROVED_TARGET: 'different-target',
      }),
    /approved database target/i,
  );
});

test('database configuration rejects an invalid URL', () => {
  assert.throws(
    () =>
      parseDatabaseConfig({
        VQ_DATABASE_URL: 'not-a-postgres-url',
        VQ_DATABASE_TARGET: 'local-test',
        VQ_DATABASE_APPROVED_TARGET: 'local-test',
      }),
    /configuration is invalid/i,
  );
});

test('unavailable database connections fail truthfully', async () => {
  await assert.rejects(
    runMigrations(
      parseDatabaseConfig({
        VQ_DATABASE_URL:
          'postgres://vq_s014_runner@127.0.0.1:55433/vibequest_s01_4_unavailable',
        VQ_DATABASE_TARGET: 'vibequest_s01_4_unavailable',
        VQ_DATABASE_APPROVED_TARGET: 'vibequest_s01_4_unavailable',
        VQ_DATABASE_CONNECT_TIMEOUT_MS: '500',
      }),
      [],
    ),
  );
});

test('missing PostGIS is rejected by the capability gate', async () => {
  assert.ok(
    noPostgisDatabaseUrl,
    'VQ_TEST_DATABASE_NO_POSTGIS_URL is required',
  );
  assert.ok(
    noPostgisDatabaseTarget,
    'VQ_TEST_DATABASE_NO_POSTGIS_TARGET is required',
  );
  await assert.rejects(
    runMigrations(
      parseDatabaseConfig({
        VQ_DATABASE_URL: noPostgisDatabaseUrl,
        VQ_DATABASE_TARGET: noPostgisDatabaseTarget,
        VQ_DATABASE_APPROVED_TARGET: noPostgisDatabaseTarget,
      }),
      [],
    ),
    /PostGIS/i,
  );
});

test('duplicate and out-of-order migration identifiers are rejected', async () => {
  const config = requireIntegrationConfig();
  await assert.rejects(
    runMigrations(config, [
      { version: '1000_duplicate_probe', sql: 'SELECT 1' },
      { version: '1000_duplicate_probe', sql: 'SELECT 2' },
    ]),
    /unique/i,
  );
  await assert.rejects(
    runMigrations(config, [
      { version: '1001_order_probe', sql: 'SELECT 1' },
      { version: '1000_order_probe', sql: 'SELECT 2' },
    ]),
    /order/i,
  );
});

test('migration authority verifies PostGIS and records a successful ledger', async () => {
  const result = await runMigrations(requireIntegrationConfig());
  assert.equal(result.postgis.available, true);
  assert.ok(result.postgis.version.length > 0);
  assert.ok(result.ledger.every((entry) => entry.outcome === 'applied'));
});

test('migration authority serializes two independent runners', async () => {
  const config = requireIntegrationConfig();
  const migration: MigrationDefinition = {
    version: '9999a_concurrency_probe',
    sql: 'SELECT pg_sleep(0.25)',
  };

  const [first, second] = await Promise.all([
    runMigrations(config, [migration]),
    runMigrations(config, [migration]),
  ]);

  const firstEntry = first.ledger.find(
    (entry) => entry.version === migration.version,
  );
  const secondEntry = second.ledger.find(
    (entry) => entry.version === migration.version,
  );
  assert.ok(firstEntry);
  assert.ok(secondEntry);
  assert.equal(firstEntry.checksum, secondEntry.checksum);
});

test('modified applied migrations are rejected', async () => {
  const config = requireIntegrationConfig();
  const original: MigrationDefinition = {
    version: '9999b_checksum_probe',
    sql: 'SELECT 1',
  };
  await runMigrations(config, [original]);

  await assert.rejects(
    runMigrations(config, [{ ...original, sql: 'SELECT 2' }]),
    /checksum/i,
  );
});

test('failed migrations do not create a successful ledger entry', async () => {
  const config = requireIntegrationConfig();
  const failure: MigrationDefinition = {
    version: '9999c_rollback_probe',
    sql: 'SELECT * FROM vq_s01_4_missing_relation',
  };

  await assert.rejects(runMigrations(config, [failure]));
  const result = await runMigrations(config, []);
  assert.equal(
    result.ledger.some((entry) => entry.version === failure.version),
    false,
  );
});
