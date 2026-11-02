import type { RuntimeIdentity } from '../../../packages/contracts/src/runtime-identity.js';

export interface ApiDependencyCheck {
  check: () => Promise<boolean>;
}

export interface HealthResult {
  status: 'alive' | 'ready';
  identity?: RuntimeIdentity;
}

export async function checkApiReadiness(
  identity: RuntimeIdentity | undefined,
  dependencies: ApiDependencyCheck,
): Promise<HealthResult> {
  if (!identity || !(await dependencies.check())) {
    throw new Error('API is not ready');
  }
  return { status: 'ready', identity };
}
