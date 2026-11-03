import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import test, { after, before } from 'node:test';
import type { Pool } from 'pg';

import { createDatabasePool } from '../../../apps/api/src/database/adapter.js';
import { parseDatabaseConfig } from '../../../apps/api/src/database/config.js';
import { runMigrations } from '../../../apps/api/src/database/migrator.js';
import {
  cleanupFixtureNamespace,
  loadProfileFixture,
  readProfile,
} from '../../../apps/api/src/d02/profile-fixtures.js';
import {
  createMediaUpload,
  verifyMediaUpload,
} from '../../../apps/api/src/d13/media-assets.js';
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
let pool: Pool;
const fixtureUserIds = new Set<string>();
const fixtureAccountIds = new Set<string>();
const fixtureNamespaces = new Set<string>();

class TestObjectStore implements MediaObjectStore {
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

before(async () => {
  await runMigrations(config);
  pool = createDatabasePool(config);
});

after(async () => {
  for (const namespace of fixtureNamespaces) {
    await cleanupFixtureNamespace(pool, 'test', namespace);
  }
  for (const accountId of fixtureAccountIds) {
    await pool.query(
      'DELETE FROM vq_d13_retirement_intents WHERE media_asset_id IN (SELECT id FROM vq_d13_media_assets WHERE owner_account_id = $1)',
      [accountId],
    );
    await pool.query(
      'DELETE FROM vq_d13_media_assets WHERE owner_account_id = $1',
      [accountId],
    );
  }
  for (const userId of fixtureUserIds) {
    await pool.query('DELETE FROM vq_d01_users WHERE id = $1', [userId]);
  }
  await pool.end();
});

test('D02 fixture profile is attributed, idempotent, and namespace-cleanable', async () => {
  const userId = randomUUID();
  const accountId = `integration-${randomUUID()}`;
  const namespace = `s02-4-${randomUUID().slice(0, 8)}`;
  fixtureUserIds.add(userId);
  fixtureAccountIds.add(accountId);
  fixtureNamespaces.add(namespace);
  await pool.query(
    'INSERT INTO vq_d01_users (id, account_id) VALUES ($1, $2)',
    [userId, accountId],
  );

  const first = await loadProfileFixture(pool, {
    environment: 'test',
    namespace,
    userId,
    accountId,
    displayName: 'Fixture owner',
  });
  const second = await loadProfileFixture(pool, {
    environment: 'test',
    namespace,
    userId,
    accountId,
    profileId: first.id,
    displayName: 'Fixture owner updated',
  });
  assert.equal(second.id, first.id);
  assert.equal(
    (await readProfile(pool, accountId))?.displayName,
    'Fixture owner updated',
  );
  assert.equal(await cleanupFixtureNamespace(pool, 'test', namespace), 1);
  assert.equal(await readProfile(pool, accountId), null);
});

test('D13 provider failure does not persist a media asset', async () => {
  const store = new TestObjectStore();
  store.fail = true;
  const ownerAccountId = `account-provider-failure-${randomUUID()}`;
  await assert.rejects(() =>
    createMediaUpload(pool, store, {
      ownerAccountId,
      purpose: 'profile',
      mimeType: 'image/jpeg',
      byteSize: 100,
      idempotencyKey: `failure-${randomUUID()}`,
    }),
  );
  const result = await pool.query(
    `SELECT count(*)::int AS count
       FROM vq_d13_media_assets
      WHERE owner_account_id = $1`,
    [ownerAccountId],
  );
  assert.equal(result.rows[0].count, 0);
});

test('D13 upload is idempotent and verifies an owned provider object', async () => {
  const store = new TestObjectStore();
  const idempotencyKey = `upload-${randomUUID()}`;
  const input = {
    ownerAccountId: `account-media-owner-${randomUUID()}`,
    purpose: 'profile',
    mimeType: 'image/jpeg',
    byteSize: 100,
    idempotencyKey,
  };
  fixtureAccountIds.add(input.ownerAccountId);
  const first = await createMediaUpload(pool, store, input);
  const second = await createMediaUpload(pool, store, input);
  assert.equal(second.asset.id, first.asset.id);
  await assert.rejects(
    () =>
      createMediaUpload(pool, store, {
        ...input,
        ownerAccountId: `different-owner-${randomUUID()}`,
      }),
    /another owner/i,
  );
  const verified = await verifyMediaUpload(
    pool,
    store,
    first.asset.id,
    input.ownerAccountId,
  );
  assert.equal(verified.status, 'verified');
  await assert.rejects(() =>
    verifyMediaUpload(pool, store, first.asset.id, 'different-owner'),
  );
});
