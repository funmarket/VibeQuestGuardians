import express, { type Express } from 'express';
import type { Server } from 'node:http';
import { errorResponse } from '../../../packages/contracts/src/error-envelope.js';
import { parseWorkerConfig, type WorkerConfig } from './config.js';
import { checkWorkerReadiness, type WorkerDependencyCheck } from './health.js';

export interface WorkerAppOptions {
  env?: NodeJS.ProcessEnv;
  dependencies?: WorkerDependencyCheck;
}

export function createWorkerApp(options: WorkerAppOptions = {}): Express {
  let config: WorkerConfig | undefined;
  let configError: Error | undefined;
  try {
    config = parseWorkerConfig(options.env ?? process.env);
  } catch (error) {
    configError =
      error instanceof Error
        ? error
        : new Error('Invalid Worker configuration');
  }

  const dependencies = options.dependencies ?? { check: async () => true };
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
        .json(await checkWorkerReadiness(config.identity, dependencies));
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

export function createWorkerServer(options: WorkerAppOptions = {}): Server {
  const app = createWorkerApp(options);
  const port = options.env ? parseWorkerConfig(options.env).port : 3001;
  return app.listen(port);
}
