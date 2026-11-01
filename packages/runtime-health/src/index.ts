export interface RuntimeIdentity {
  service: 'api' | 'worker';
  environment: string;
  revision: string;
  gitSha: string;
  deploymentId: string;
}

export interface ReadinessCheck {
  name: string;
  ok: boolean;
  detail?: string;
}

export interface ReadinessResponse {
  status: 'ready' | 'not_ready';
  identity: RuntimeIdentity;
  checks: ReadinessCheck[];
}

export interface HealthDatabase {
  query<T extends Record<string, unknown>>(
    sql: string,
  ): Promise<{ rows: T[] }>;
}

export async function createReadinessResponse(
  identity: RuntimeIdentity,
  database: HealthDatabase,
): Promise<ReadinessResponse> {
  const checks: ReadinessCheck[] = [];
  const identityOk = [
    identity.service,
    identity.environment,
    identity.revision,
    identity.gitSha,
    identity.deploymentId,
  ].every((value) => value.length > 0 && value !== 'unknown');

  checks.push({
    name: 'runtime_identity',
    ok: identityOk,
    detail: identityOk ? 'complete' : 'missing deployment identity',
  });

  try {
    await database.query('SELECT 1');
    checks.push({ name: 'database', ok: true });
  } catch {
    checks.push({ name: 'database', ok: false, detail: 'database query failed' });
  }

  try {
    const result = await database.query<{ extname: string }>(
      "SELECT extname FROM pg_extension WHERE extname = 'postgis'",
    );
    checks.push({
      name: 'postgis',
      ok: result.rows.some((row) => row.extname === 'postgis'),
      detail: result.rows.some((row) => row.extname === 'postgis')
        ? undefined
        : 'PostGIS extension unavailable',
    });
  } catch {
    checks.push({ name: 'postgis', ok: false, detail: 'PostGIS extension unavailable' });
  }

  try {
    const result = await database.query<{ version: string }>(
      'SELECT version FROM vq_schema_migrations ORDER BY version',
    );
    checks.push({
      name: 'migration_ledger',
      ok: result.rows.length > 0,
      detail: result.rows.length > 0 ? undefined : 'migration ledger is empty',
    });
  } catch {
    checks.push({
      name: 'migration_ledger',
      ok: false,
      detail: 'migration ledger unavailable',
    });
  }

  return {
    status: checks.every((check) => check.ok) ? 'ready' : 'not_ready',
    identity,
    checks,
  };
}
