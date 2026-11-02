import assert from 'node:assert/strict';
import { once } from 'node:events';
import test from 'node:test';
import type { Server } from 'node:http';

async function loadApiModule(): Promise<Record<string, unknown> | undefined> {
  try {
    return (await import('../../../apps/api/src/app.js')) as Record<
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

async function withServer(
  app: { listen: (port: number) => Server },
  callback: (baseUrl: string) => Promise<void>,
) {
  const server = app.listen(0);
  await once(server, 'listening');
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  try {
    await callback(`http://127.0.0.1:${address.port}`);
  } finally {
    server.close();
    await once(server, 'close');
  }
}

test('API exposes separate liveness and readiness over HTTP', async () => {
  const module = await loadApiModule();
  assert.ok(module, 'API app module must exist');
  const createApiApp = module.createApiApp as (options?: unknown) => {
    listen: (port: number) => Server;
  };
  const env = {
    VQ_REPOSITORY: 'funmarket/VibeQuestGuardians',
    VQ_REF: 'vibefoundation',
    VQ_COMMIT: 'a'.repeat(40),
    VQ_BUILD: 'build-001',
    VQ_SERVING_REVISION: 'revision-001',
    VQ_ENVIRONMENT: 'test',
  };
  await withServer(createApiApp({ env }), async (baseUrl) => {
    const live = await fetch(`${baseUrl}/health/live`);
    const ready = await fetch(`${baseUrl}/health/ready`);
    assert.equal(live.status, 200);
    assert.equal(ready.status, 200);
    assert.deepEqual((await live.json()) as unknown, { status: 'alive' });
  });
});

test('API readiness rejects invalid configuration while liveness remains available', async () => {
  const module = await loadApiModule();
  assert.ok(module, 'API app module must exist');
  const createApiApp = module.createApiApp as (options?: unknown) => {
    listen: (port: number) => Server;
  };
  await withServer(createApiApp({ env: {} }), async (baseUrl) => {
    const live = await fetch(`${baseUrl}/health/live`);
    const ready = await fetch(`${baseUrl}/health/ready`);
    assert.equal(live.status, 200);
    assert.equal(ready.status, 503);
  });
  await withServer(
    createApiApp({
      env: {
        VQ_REPOSITORY: 'funmarket/VibeQuestGuardians',
        VQ_REF: 'vibefoundation',
        VQ_COMMIT: 'a'.repeat(40),
        VQ_BUILD: 'build-001',
        VQ_SERVING_REVISION: 'revision-001',
        VQ_ENVIRONMENT: 'test',
      },
      dependencies: { check: async () => false },
    }),
    async (baseUrl) => {
      const live = await fetch(`${baseUrl}/health/live`);
      const ready = await fetch(`${baseUrl}/health/ready`);
      assert.equal(live.status, 200);
      assert.equal(ready.status, 503);
    },
  );
});

test('API readiness rejects an unavailable configured database', async () => {
  const module = await loadApiModule();
  assert.ok(module, 'API app module must exist');
  const createApiApp = module.createApiApp as (options?: unknown) => {
    listen: (port: number) => Server;
  };
  await withServer(
    createApiApp({
      env: {
        VQ_REPOSITORY: 'funmarket/VibeQuestGuardians',
        VQ_REF: 'vibefoundation',
        VQ_COMMIT: 'a'.repeat(40),
        VQ_BUILD: 'build-001',
        VQ_SERVING_REVISION: 'revision-001',
        VQ_ENVIRONMENT: 'staging',
        VQ_DATABASE_URL:
          'postgresql://vq_staging@127.0.0.1:1/vibequest_staging',
        VQ_DATABASE_TARGET: 'vibequest_staging',
        VQ_DATABASE_APPROVED_TARGET: 'vibequest_staging',
        VQ_DATABASE_CONNECT_TIMEOUT_MS: '100',
      },
    }),
    async (baseUrl) => {
      const live = await fetch(`${baseUrl}/health/live`);
      const ready = await fetch(`${baseUrl}/health/ready`);
      assert.equal(live.status, 200);
      assert.equal(ready.status, 503);
    },
  );
});
