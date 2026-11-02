import express, { type Express } from 'express';
import type { Server } from 'node:http';
import { errorResponse } from '../../../packages/contracts/src/error-envelope.js';
import { parseApiConfig, type ApiConfig } from './config.js';
import { parseDatabaseConfig } from './database/config.js';
import { verifyMigrationReadiness } from './database/migrator.js';
import { checkApiReadiness, type ApiDependencyCheck } from './health.js';

export interface ApiAppOptions {
  env?: NodeJS.ProcessEnv;
  dependencies?: ApiDependencyCheck;
}

function createDefaultDependencies(env: NodeJS.ProcessEnv): ApiDependencyCheck {
  if (!env.VQ_DATABASE_URL) {
    return { check: async () => true };
  }

  try {
    const databaseConfig = parseDatabaseConfig(env);
    return {
      check: async () => {
        try {
          await verifyMigrationReadiness(databaseConfig);
          return true;
        } catch {
          return false;
        }
      },
    };
  } catch {
    return { check: async () => false };
  }
}

export function createApiApp(options: ApiAppOptions = {}): Express {
  let config: ApiConfig | undefined;
  let configError: Error | undefined;
  try {
    config = parseApiConfig(options.env ?? process.env);
  } catch (error) {
    configError =
      error instanceof Error ? error : new Error('Invalid API configuration');
  }

  const dependencies =
    options.dependencies ??
    createDefaultDependencies(options.env ?? process.env);
  const app = express();
  app.disable('x-powered-by');
  app.get('/health/live', (_request, response) => {
    response.status(200).json({ status: 'alive' });
  });
  app.get('/health/identity', (_request, response) => {
    if (!config) {
      response
        .status(503)
        .json(
          errorResponse(
            'DEPENDENCY_ERROR',
            'Required dependency unavailable',
            503,
          ),
        );
      return;
    }
    response.status(200).json(config.identity);
  });
  app.get('/health/ready', async (_request, response) => {
    if (configError || !config) {
      response
        .status(503)
        .json(
          errorResponse('VALIDATION_ERROR', 'Request validation failed', 503),
        );
      return;
    }
    try {
      response
        .status(200)
        .json(await checkApiReadiness(config.identity, dependencies));
    } catch {
      response
        .status(503)
        .json(
          errorResponse(
            'DEPENDENCY_ERROR',
            'Required dependency unavailable',
            503,
          ),
        );
    }
  });
  return app;
}

export function createApiServer(options: ApiAppOptions = {}): Server {
  const app = createApiApp(options);
  const port = options.env ? parseApiConfig(options.env).port : 3000;
  return app.listen(port);
}
