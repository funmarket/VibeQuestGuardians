import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Pool } = pg;
const migrationsDirectory = fileURLToPath(
  new URL('../database/migrations/', import.meta.url),
);
const args = new Set(process.argv.slice(2));
const files = (await readdir(migrationsDirectory))
  .filter((file) => file.endsWith('.sql'))
  .sort();

if (args.has('--validate')) {
  if (files.some((file) => !/^\d{4}_[a-z0-9_]+\.sql$/.test(file))) {
    throw new Error('Invalid migration filename');
  }

  console.log(JSON.stringify({ valid: true, migrations: files }));
  process.exit(0);
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const client = await pool.connect();

try {
  await client.query('SELECT pg_advisory_lock($1)', [861001]);
  await client.query(
    'CREATE TABLE IF NOT EXISTS vq_schema_migrations (version text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())',
  );

  const applied = (
    await client.query(
      'SELECT version, checksum, applied_at FROM vq_schema_migrations ORDER BY version',
    )
  ).rows;

  if (args.has('--status')) {
    console.log(
      JSON.stringify({
        applied,
        pending: files.filter(
          (file) => !applied.some((row) => row.version === file),
        ),
      }),
    );
  } else {
    for (const file of files) {
      const sql = await readFile(join(migrationsDirectory, file), 'utf8');
      const checksum = createHash('sha256').update(sql).digest('hex');
      const existing = applied.find((row) => row.version === file);

      if (existing) {
        if (existing.checksum !== checksum) {
          throw new Error('Applied migration changed: ' + file);
        }
        continue;
      }

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO vq_schema_migrations(version, checksum) VALUES($1, $2)',
          [file, checksum],
        );
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }

    console.log(JSON.stringify({ applied: files }));
  }
} finally {
  await client
    .query('SELECT pg_advisory_unlock($1)', [861001])
    .catch(() => undefined);
  client.release();
  await pool.end();
}
