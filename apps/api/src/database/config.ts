import { z } from 'zod';

const databaseEnvironmentSchema = z.object({
  VQ_DATABASE_URL: z.string().url().startsWith('postgres'),
  VQ_DATABASE_TARGET: z.string().min(1),
  VQ_DATABASE_APPROVED_TARGET: z.string().min(1),
  VQ_DATABASE_CONNECT_TIMEOUT_MS: z.string().regex(/^\d+$/).optional(),
});

export class DatabaseConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseConfigurationError';
  }
}

export interface DatabaseConfig {
  connectionString: string;
  target: string;
  connectTimeoutMs: number;
}

export function parseDatabaseConfig(env: NodeJS.ProcessEnv): DatabaseConfig {
  const parsed = databaseEnvironmentSchema.safeParse(env);
  if (!parsed.success) {
    throw new DatabaseConfigurationError(
      'Required database configuration is invalid',
    );
  }
  if (
    parsed.data.VQ_DATABASE_TARGET !== parsed.data.VQ_DATABASE_APPROVED_TARGET
  ) {
    throw new DatabaseConfigurationError(
      'Database target is not an approved database target',
    );
  }

  return {
    connectionString: parsed.data.VQ_DATABASE_URL,
    target: parsed.data.VQ_DATABASE_TARGET,
    connectTimeoutMs: parsed.data.VQ_DATABASE_CONNECT_TIMEOUT_MS
      ? Number(parsed.data.VQ_DATABASE_CONNECT_TIMEOUT_MS)
      : 5_000,
  };
}
