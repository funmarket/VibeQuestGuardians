import { describe, expect, it } from 'vitest';
import { createReadinessResponse } from '@vibe/runtime-health';

const identity = {
  service: 'api' as const,
  environment: 'test',
  revision: 'test-revision',
  gitSha: 'test-sha',
  deploymentId: 'test-deployment',
};

describe('runtime readiness', () => {
  it('is not ready when a required database check fails', async () => {
    const database = {
      query: async () => {
        throw new Error('unavailable');
      },
    };

    const result = await createReadinessResponse(identity, database);

    expect(result.status).toBe('not_ready');
    expect(result.checks.some((check) => check.name === 'database' && !check.ok)).toBe(true);
  });

  it('is not ready when PostGIS or the migration ledger is absent', async () => {
    const database = {
      query: async <T extends Record<string, unknown>>(sql: string): Promise<{ rows: T[] }> => {
        if (sql.includes('pg_extension')) return { rows: [] as unknown as T[] };
        if (sql.includes('vq_schema_migrations')) return { rows: [] as T[] };
        return { rows: [{}] as T[] };
      },
    };

    const result = await createReadinessResponse(identity, database);

    expect(result.status).toBe('not_ready');
    expect(result.checks.find((check) => check.name === 'postgis')?.ok).toBe(false);
    expect(result.checks.find((check) => check.name === 'migration_ledger')?.ok).toBe(false);
  });

  it('is ready when all required substrate checks succeed', async () => {
    const database = {
      query: async <T extends Record<string, unknown>>(sql: string): Promise<{ rows: T[] }> => {
        if (sql.includes('pg_extension')) return { rows: [{ extname: 'postgis' }] as T[] };
        if (sql.includes('vq_schema_migrations')) return { rows: [{ version: '0001_postgis_foundation.sql' }] as T[] };
        return { rows: [{}] as T[] };
      },
    };

    const result = await createReadinessResponse(identity, database);

    expect(result.status).toBe('ready');
    expect(result.checks.every((check) => check.ok)).toBe(true);
  });
});
