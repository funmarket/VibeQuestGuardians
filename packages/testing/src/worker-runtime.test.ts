import assert from 'node:assert/strict';
import { once } from 'node:events';
import test from 'node:test';
import type { Server } from 'node:http';

async function loadWorkerModule(): Promise<
  Record<string, unknown> | undefined
> {
  try {
    return (await import('../../../apps/worker/src/app.js')) as Record<
      string,
      unknown
    >;
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      error.code === 'ERR_MODULE_NOT_FOUND'
    ) {
      return undefined;
    }
    throw error;
  }
}

test('Worker exposes a separate liveness/readiness runtime boundary', async () => {
  const module = await loadWorkerModule();
  assert.ok(module, 'Worker app module must exist');
  const createWorkerApp = module.createWorkerApp as (options?: unknown) => {
    listen: (port: number) => Server;
  };
  const server = createWorkerApp({
    env: {
      VQ_REPOSITORY: 'funmarket/VibeQuestGuardians',
      VQ_REF: 'vibefoundation',
      VQ_COMMIT: 'a'.repeat(40),
      VQ_BUILD: 'build-001',
      VQ_SERVING_REVISION: 'revision-001',
      VQ_ENVIRONMENT: 'test',
    },
  }).listen(0);
  await once(server, 'listening');
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  const live = await fetch(`http://127.0.0.1:${address.port}/health/live`);
  const ready = await fetch(`http://127.0.0.1:${address.port}/health/ready`);
  assert.equal(live.status, 200);
  assert.equal(ready.status, 200);
  server.close();
  await once(server, 'close');
});

test('Worker readiness rejects missing configuration without starting business work', async () => {
  const module = await loadWorkerModule();
  assert.ok(module, 'Worker app module must exist');
  const createWorkerApp = module.createWorkerApp as (options?: unknown) => {
    listen: (port: number) => Server;
  };
  const server = createWorkerApp({ env: {} }).listen(0);
  await once(server, 'listening');
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  const live = await fetch(`http://127.0.0.1:${address.port}/health/live`);
  const ready = await fetch(`http://127.0.0.1:${address.port}/health/ready`);
  assert.equal(live.status, 200);
  assert.equal(ready.status, 503);
  server.close();
  await once(server, 'close');
});

test('Worker configuration accepts the Railway PORT variable', async () => {
  const module = await loadWorkerModule();
  assert.ok(module, 'Worker app module must exist');
  const configModule = (await import('../../../apps/worker/src/config.js')) as {
    parseWorkerConfig: (env: NodeJS.ProcessEnv) => { port: number };
  };
  const config = configModule.parseWorkerConfig({
    VQ_REPOSITORY: 'funmarket/VibeQuestGuardians',
    VQ_REF: 'vibefoundation',
    VQ_COMMIT: 'a'.repeat(40),
    VQ_BUILD: 'build-001',
    VQ_SERVING_REVISION: 'revision-001',
    VQ_ENVIRONMENT: 'staging',
    PORT: '4321',
  });
  assert.equal(config.port, 4321);
});
