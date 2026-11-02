import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { once } from 'node:events';
import test, { after, before, beforeEach } from 'node:test';
import type { Server } from 'node:http';
import type { Pool } from 'pg';

import { createApiApp, createApiServer } from '../../../apps/api/src/app.js';
import { createDatabasePool } from '../../../apps/api/src/database/adapter.js';
import { parseDatabaseConfig } from '../../../apps/api/src/database/config.js';
import { runMigrations } from '../../../apps/api/src/database/migrator.js';
import {
  createPostgresSessionStore,
  type SessionStore,
} from '../../../apps/api/src/identity/session.js';

const databaseUrl = process.env.VQ_TEST_DATABASE_URL;
const databaseTarget = process.env.VQ_TEST_DATABASE_TARGET;
assert.ok(databaseUrl, 'VQ_TEST_DATABASE_URL is required');
assert.ok(databaseTarget, 'VQ_TEST_DATABASE_TARGET is required');

const databaseConfig = parseDatabaseConfig({
  VQ_DATABASE_URL: databaseUrl,
  VQ_DATABASE_TARGET: databaseTarget,
  VQ_DATABASE_APPROVED_TARGET: databaseTarget,
});
const apiEnv = {
  VQ_REPOSITORY: 'funmarket/VibeQuestGuardians',
  VQ_REF: 'vibefoundation',
  VQ_COMMIT: 'a'.repeat(40),
  VQ_BUILD: 's02-2-test',
  VQ_SERVING_REVISION: 's02-2-test',
  VQ_ENVIRONMENT: 'test',
  VQ_DATABASE_URL: databaseUrl,
  VQ_DATABASE_TARGET: databaseTarget,
  VQ_DATABASE_APPROVED_TARGET: databaseTarget,
};
const rawToken = 's02-2-test-token';
const tokenHash = createHash('sha256').update(rawToken).digest('hex');
const userId = '00000000-0000-4000-8000-000000000001';
const sessionId = '00000000-0000-4000-8000-000000000002';
let fixturePool: Pool;
let sessionStore: SessionStore;
let server: Server;

async function request(path: string, init?: RequestInit): Promise<Response> {
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  return fetch(`http://127.0.0.1:${address.port}${path}`, init);
}

before(async () => {
  await runMigrations(databaseConfig);
  fixturePool = createDatabasePool(databaseConfig);
  sessionStore = createPostgresSessionStore(databaseConfig);
  const app = createApiApp({ env: apiEnv, sessionStore });
  server = app.listen(0);
  await once(server, 'listening');
});

beforeEach(async () => {
  await fixturePool.query('DELETE FROM vq_d01_sessions');
  await fixturePool.query('DELETE FROM vq_d01_users');
  await fixturePool.query(
    `INSERT INTO vq_d01_users (id, account_id, created_at)
     VALUES ($1, $2, now())`,
    [userId, 'account-001'],
  );
  await fixturePool.query(
    `INSERT INTO vq_d01_sessions
       (id, user_id, token_hash, host, capabilities, expires_at)
     VALUES ($1, $2, $3, 'web', $4, now() + interval '1 hour')`,
    [sessionId, userId, tokenHash, ['profile:read']],
  );
});

after(async () => {
  server.close();
  await once(server, 'close');
  await sessionStore.close();
  await fixturePool.end();
});

test('rejects a request with no session credential', async () => {
  const response = await request('/me');
  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), {
    version: 1,
    error: {
      category: 'AUTHORIZATION_ERROR',
      message: 'Authorization required',
      status: 401,
    },
  });
});

test('rejects malformed and unknown bearer credentials', async () => {
  const malformed = await request('/me', {
    headers: { authorization: 'Basic not-a-bearer-token' },
  });
  const unknown = await request('/me', {
    headers: { authorization: 'Bearer unknown-token' },
  });
  assert.equal(malformed.status, 401);
  assert.equal(unknown.status, 401);
});

test('resolves the canonical principal from a valid database session', async () => {
  const response = await request('/me', {
    headers: { authorization: `Bearer ${rawToken}` },
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    accountId: 'account-001',
    sessionId,
    host: 'web',
    capabilities: ['profile:read'],
  });
});

test('does not expose the raw token or database fields', async () => {
  const response = await request('/me', {
    headers: { authorization: `Bearer ${rawToken}` },
  });
  const body = JSON.stringify(await response.json());
  assert.equal(body.includes(rawToken), false);
  assert.equal(body.includes('token_hash'), false);
  assert.equal(body.includes('account-001'), true);
});

test('rejects expired and revoked sessions', async () => {
  await fixturePool.query(
    `UPDATE vq_d01_sessions SET expires_at = now() - interval '1 minute' WHERE id = $1`,
    [sessionId],
  );
  const expired = await request('/me', {
    headers: { authorization: `Bearer ${rawToken}` },
  });
  assert.equal(expired.status, 401);

  await fixturePool.query(
    `UPDATE vq_d01_sessions
        SET expires_at = now() + interval '1 hour', revoked_at = now()
      WHERE id = $1`,
    [sessionId],
  );
  const revoked = await request('/me', {
    headers: { authorization: `Bearer ${rawToken}` },
  });
  assert.equal(revoked.status, 401);
});

test('revokes only the authenticated session and is idempotent', async () => {
  const first = await request('/sessions/revoke', {
    method: 'POST',
    headers: { authorization: `Bearer ${rawToken}` },
  });
  const second = await request('/sessions/revoke', {
    method: 'POST',
    headers: { authorization: `Bearer ${rawToken}` },
  });
  const current = await request('/me', {
    headers: { authorization: `Bearer ${rawToken}` },
  });
  assert.equal(first.status, 204);
  assert.equal(second.status, 204);
  assert.equal(current.status, 401);
});

test('reports a session database failure as a dependency error', async () => {
  const failingStore: SessionStore = {
    resolve: async () => {
      throw new Error('database unavailable');
    },
    revoke: async () => {
      throw new Error('database unavailable');
    },
    close: async () => undefined,
  };
  const failingServer = createApiApp({
    env: apiEnv,
    sessionStore: failingStore,
  }).listen(0);
  await once(failingServer, 'listening');
  const address = failingServer.address();
  assert.ok(address && typeof address === 'object');
  try {
    const response = await fetch(`http://127.0.0.1:${address.port}/me`, {
      headers: { authorization: `Bearer ${rawToken}` },
    });
    assert.equal(response.status, 503);
  } finally {
    failingServer.close();
    await once(failingServer, 'close');
  }
});

test('API shutdown closes the session store', async () => {
  let closed = false;
  const trackingStore: SessionStore = {
    resolve: async () => {
      throw new Error('not used');
    },
    revoke: async () => false,
    close: async () => {
      closed = true;
    },
  };
  const shutdownServer = createApiServer({
    env: { ...apiEnv, API_PORT: '0' },
    sessionStore: trackingStore,
  });
  await once(shutdownServer, 'listening');
  shutdownServer.close();
  await once(shutdownServer, 'close');
  assert.equal(closed, true);
});
