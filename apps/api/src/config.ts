import { z } from 'zod';
import {
  parseRuntimeIdentity,
  type RuntimeIdentity,
} from '../../../packages/contracts/src/runtime-identity.js';

const apiEnvironmentSchema = z
  .object({
    VQ_REPOSITORY: z.string().min(1),
    VQ_REF: z.string().min(1),
    VQ_COMMIT: z.string().min(1),
    VQ_BUILD: z.string().min(1),
    VQ_SERVING_REVISION: z.string().min(1).optional(),
    RAILWAY_DEPLOYMENT_ID: z.string().min(1).optional(),
    VQ_ENVIRONMENT: z.string().min(1),
    API_PORT: z.string().regex(/^\d+$/).optional(),
    PORT: z.string().regex(/^\d+$/).optional(),
  })
  .refine(
    (value) => value.VQ_SERVING_REVISION || value.RAILWAY_DEPLOYMENT_ID,
    'Serving revision is required',
  );

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

export interface ApiConfig {
  identity: RuntimeIdentity;
  port: number;
}

export function parseApiConfig(env: NodeJS.ProcessEnv): ApiConfig {
  const parsed = apiEnvironmentSchema.safeParse(env);
  if (!parsed.success) {
    throw new ConfigurationError('Required API configuration is invalid');
  }

  try {
    return {
      identity: parseRuntimeIdentity({
        repository: parsed.data.VQ_REPOSITORY,
        ref: parsed.data.VQ_REF,
        commit: parsed.data.VQ_COMMIT,
        build: parsed.data.VQ_BUILD,
        servingRevision:
          parsed.data.VQ_SERVING_REVISION ?? parsed.data.RAILWAY_DEPLOYMENT_ID!,
        environment: parsed.data.VQ_ENVIRONMENT,
      }),
      port: parsed.data.API_PORT
        ? Number(parsed.data.API_PORT)
        : parsed.data.PORT
          ? Number(parsed.data.PORT)
          : 3000,
    };
  } catch {
    throw new ConfigurationError('Required API configuration is invalid');
  }
}
