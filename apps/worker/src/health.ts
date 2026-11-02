import type { RuntimeIdentity } from '../../../packages/contracts/src/runtime-identity.js';

export interface WorkerDependencyCheck {
  check: () => Promise<boolean>;
}

export async function checkWorkerReadiness(
  identity: RuntimeIdentity | undefined,
  dependencies: WorkerDependencyCheck,
): Promise<{ status: 'ready'; identity: RuntimeIdentity }> {
  if (!identity || !(await dependencies.check())) {
    throw new Error('Worker is not ready');
  }
  return { status: 'ready', identity };
}
