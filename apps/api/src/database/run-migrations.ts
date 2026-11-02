import { parseDatabaseConfig } from './config.js';
import { runMigrations } from './migrator.js';

async function main(): Promise<void> {
  if (process.env.VQ_ENVIRONMENT !== 'staging') {
    throw new Error('Staging migration runner requires VQ_ENVIRONMENT=staging');
  }
  if (!process.env.VQ_DATABASE_TARGET?.endsWith('_staging')) {
    throw new Error(
      'Staging migration runner requires a staging database target',
    );
  }

  const result = await runMigrations(parseDatabaseConfig(process.env));
  console.log(
    `migration target=${process.env.VQ_DATABASE_TARGET} postgis=${result.postgis.version} ledger=${result.ledger.length}`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Migration failed');
  process.exitCode = 1;
});
