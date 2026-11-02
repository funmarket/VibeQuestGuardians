import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const identityPath = new URL(
  '../../contracts/src/runtime-identity.ts',
  import.meta.url,
);
const apiConfigPath = new URL(
  '../../../apps/api/src/config.ts',
  import.meta.url,
);
const workerConfigPath = new URL(
  '../../../apps/worker/src/config.ts',
  import.meta.url,
);
const apiHealthPath = new URL(
  '../../../apps/api/src/health.ts',
  import.meta.url,
);
const workerHealthPath = new URL(
  '../../../apps/worker/src/health.ts',
  import.meta.url,
);

test('API and Worker import the canonical shared identity contract', async () => {
  await assert.doesNotReject(async () => readFile(identityPath, 'utf8'));
  const api = await readFile(apiConfigPath, 'utf8');
  const worker = await readFile(workerConfigPath, 'utf8');
  assert.match(api, /runtime-identity/);
  assert.match(worker, /runtime-identity/);
});

test('duplicate identity and readiness definitions are rejected by architecture checks', async () => {
  const identity = await readFile(identityPath, 'utf8');
  const api = await readFile(apiConfigPath, 'utf8');
  const worker = await readFile(workerConfigPath, 'utf8');
  const apiHealth = await readFile(apiHealthPath, 'utf8');
  const workerHealth = await readFile(workerHealthPath, 'utf8');
  assert.equal(
    (identity.match(/export function parseRuntimeIdentity/g) ?? []).length,
    1,
  );
  assert.equal((api.match(/parseRuntimeIdentity/g) ?? []).length >= 1, true);
  assert.equal((worker.match(/parseRuntimeIdentity/g) ?? []).length >= 1, true);
  assert.equal((apiHealth.match(/checkApiReadiness/g) ?? []).length, 1);
  assert.equal((workerHealth.match(/checkWorkerReadiness/g) ?? []).length, 1);
});
