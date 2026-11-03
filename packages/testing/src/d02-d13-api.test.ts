import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { once } from 'node:events';
import test, { after, before, beforeEach } from 'node:test';
import type { Server } from 'node:http';
import type { Pool } from 'pg';

import { createApiApp } from '../../../apps/api/src/app.js';
import { createDatabasePool } from '../../../apps/api/src/database/adapter.js';
import { parseDatabaseConfig } from '../../../apps/api/src/database/config.js';
import { runMigrations } from '../../../apps/api/src/database/migrator.js';
import { createSessionStore } from '../../../apps/api/src/identity/session.js';
import type { MediaObjectStore } from '../../../packages/contracts/src/d13-media.js';

const databaseUrl = process.env.VQ_TEST_DATABASE_URL;
const databaseTarget = process.env.VQ_TEST_DATABASE_TARGET;
assert.ok(databaseUrl, 'VQ_TEST_DATABASE_URL is required');
assert.ok(databaseTarget, 'VQ_TEST_DATABASE_TARGET is required');

const config = parseDatabaseConfig({
  VQ_DATABASE_URL: databaseUrl,
  VQ_DATABASE_TARGET: databaseTarget,
  VQ_DATABASE_APPROVED_TARGET: databaseTarget,
});
const rawToken = `api-${randomUUID()}`;
const userId = randomUUID();
const sessionId = randomUUID();
const accountId = `api-${randomUUID()}`;
let pool: Pool;
let server: Server;

class ApiObjectStore implements MediaObjectStore {
  readonly objects = new Set<string>();
  fail = false;

  async createUpload(input: {
    objectKey: string;
  }): Promise<{ uploadUrl: string }> {
    if (this.fail) throw new Error('provider unavailable');
    this.objects.add(input.objectKey);
    return {
      uploadUrl: `https://upload.invalid/${encodeURIComponent(input.objectKey)}`,
    };
  }

  async hasObject(input: { objectKey: string }): Promise<boolean> {
    return this.objects.has(input.objectKey);
  }

  async deleteObject(input: { objectKey: string }): Promise<void> {
    this.objects.delete(input.objectKey);
  }
}

const objectStore = new ApiObjectStore();

async function request(path: string, init?: RequestInit): Promise<Response> {
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  return fetch(`http://127.0.0.1:${address.port}${path}`, init);
}

before(async () => {
  await runMigrations(config);
  pool = createDatabasePool(config);
  const tokenHash = createHash('sha256').update(rawToken).digest('hex');
  await pool.query(
    'INSERT INTO vq_d01_users (id, account_id) VALUES ($1, $2)',
    [userId, accountId],
  );
  await pool.query(
    `INSERT INTO vq_d01_sessions
       (id, user_id, token_hash, host, capabilities, expires_at)
     VALUES ($1, $2, $3, 'web', $4, now() + interval '1 hour')`,
    [sessionId, userId, tokenHash, ['profile:read', 'media:write']],
  );
  const app = createApiApp({
    env: {
      VQ_REPOSITORY: 'funmarket/VibeQuestGuardians',
      VQ_REF: 'vibefoundation',
      VQ_COMMIT: 'a'.repeat(40),
      VQ_BUILD: 'd02-d13-api-test',
      VQ_SERVING_REVISION: 'd02-d13-api-test',
      VQ_ENVIRONMENT: 'test',
      VQ_DATABASE_URL: databaseUrl,
      VQ_DATABASE_TARGET: databaseTarget,
      VQ_DATABASE_APPROVED_TARGET: databaseTarget,
    },
    sessionStore: createSessionStore(pool),
    profilePool: pool,
    mediaPool: pool,
    mediaObjectStore: objectStore,
  });
  server = app.listen(0);
  await once(server, 'listening');
});

beforeEach(() => {
  objectStore.fail = false;
});

after(async () => {
  await pool.query(
    'DELETE FROM vq_d13_retirement_intents WHERE media_asset_id IN (SELECT id FROM vq_d13_media_assets WHERE owner_account_id = $1)',
    [accountId],
  );
  await pool.query(
    'DELETE FROM vq_d13_media_assets WHERE owner_account_id = $1',
    [accountId],
  );
  await pool.query('DELETE FROM vq_d02_profiles WHERE user_id = $1', [userId]);
  await pool.query('DELETE FROM vq_d01_sessions WHERE id = $1', [sessionId]);
  await pool.query('DELETE FROM vq_d01_users WHERE id = $1', [userId]);
  server.close();
  await once(server, 'close');
  await pool.end();
});

test('D02 HTTP profile read uses the authenticated canonical account', async () => {
  const unauthorized = await request('/profile');
  assert.equal(unauthorized.status, 401);
  const response = await request('/profile', {
    headers: { authorization: `Bearer ${rawToken}` },
  });
  assert.equal(response.status, 200);
  assert.equal(await response.json(), null);
});

test('D13 HTTP upload requires identity and preserves provider failure truth', async () => {
  const response = await request('/media/uploads', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${rawToken}`,
      'content-type': 'application/json',
      'idempotency-key': `api-upload-${randomUUID()}`,
    },
    body: JSON.stringify({
      purpose: 'profile',
      mimeType: 'image/jpeg',
      byteSize: 100,
    }),
  });
  assert.equal(response.status, 201);
  const body = await response.json();
  assert.equal(body.asset.ownerAccountId, accountId);

  objectStore.fail = true;
  const failed = await request('/media/uploads', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${rawToken}`,
      'content-type': 'application/json',
      'idempotency-key': `api-failure-${randomUUID()}`,
    },
    body: JSON.stringify({
      purpose: 'profile',
      mimeType: 'image/jpeg',
      byteSize: 100,
    }),
  });
  assert.equal(failed.status, 503);
});
