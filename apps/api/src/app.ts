import express, { type Express } from 'express';
import type { Server } from 'node:http';
import { errorResponse } from '../../../packages/contracts/src/error-envelope.js';
import { IdentityContractError } from '../../../packages/contracts/src/identity-host.js';
import { parseApiConfig, type ApiConfig } from './config.js';
import { parseDatabaseConfig } from './database/config.js';
import { verifyMigrationReadiness } from './database/migrator.js';
import { checkApiReadiness, type ApiDependencyCheck } from './health.js';
import {
  createPostgresSessionStore,
  type SessionStore,
} from './identity/session.js';

export interface ApiAppOptions {
  env?: NodeJS.ProcessEnv;
  dependencies?: ApiDependencyCheck;
  sessionStore?: SessionStore;
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
  const env = options.env ?? process.env;
  let config: ApiConfig | undefined;
  let configError: Error | undefined;
  try {
    config = parseApiConfig(env);
  } catch (error) {
    configError =
      error instanceof Error ? error : new Error('Invalid API configuration');
  }

  const dependencies = options.dependencies ?? createDefaultDependencies(env);
  let sessionStore = options.sessionStore;
  if (!sessionStore && env.VQ_DATABASE_URL) {
    try {
      sessionStore = createPostgresSessionStore(parseDatabaseConfig(env));
    } catch {
      sessionStore = undefined;
    }
  }
  const app = express();
  app.disable('x-powered-by');
  app.locals.sessionStore = sessionStore;
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
  app.get('/me', async (request, response) => {
    if (!sessionStore) {
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
    const token = readBearerToken(request.header('authorization'));
    if (!token) {
      response
        .status(401)
        .json(
          errorResponse('AUTHORIZATION_ERROR', 'Authorization required', 401),
        );
      return;
    }
    try {
      response.status(200).json(await sessionStore.resolve(token));
    } catch (error) {
      if (error instanceof IdentityContractError) {
        response
          .status(401)
          .json(
            errorResponse('AUTHORIZATION_ERROR', 'Authorization required', 401),
          );
        return;
      }
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
  app.post('/sessions/revoke', async (request, response) => {
    if (!sessionStore) {
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
    const token = readBearerToken(request.header('authorization'));
    if (!token) {
      response
        .status(401)
        .json(
          errorResponse('AUTHORIZATION_ERROR', 'Authorization required', 401),
        );
      return;
    }
    try {
      if (!(await sessionStore.revoke(token))) {
        throw new IdentityContractError(
          'UNAUTHORIZED',
          'Session credential is invalid',
        );
      }
      response.status(204).send();
    } catch (error) {
      if (error instanceof IdentityContractError) {
        response
          .status(401)
          .json(
            errorResponse('AUTHORIZATION_ERROR', 'Authorization required', 401),
          );
        return;
      }
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

function readBearerToken(value: string | undefined): string | undefined {
  if (!value?.startsWith('Bearer ')) {
    return undefined;
  }
  const token = value.slice('Bearer '.length);
  return token.length > 0 && !/\s/.test(token) ? token : undefined;
}

export function createApiServer(options: ApiAppOptions = {}): Server {
  const app = createApiApp(options);
  const port = options.env ? parseApiConfig(options.env).port : 3000;
  const server = app.listen(port);
  const sessionStore = app.locals.sessionStore as SessionStore | undefined;
  if (sessionStore) {
    server.once('close', () => {
      void sessionStore.close();
    });
  }
  return server;
}
