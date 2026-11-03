import assert from 'node:assert/strict';
import test from 'node:test';
import type { S3Client } from '@aws-sdk/client-s3';

import {
  RailwayS3ObjectStore,
  readRailwayS3Config,
} from '../../../apps/api/src/d13/railway-s3-object-store.js';

test('Railway S3 configuration is absent until all provider values are supplied', () => {
  assert.equal(readRailwayS3Config({}), undefined);
  assert.throws(
    () => readRailwayS3Config({ BUCKET: 'staging-media' }),
    /incomplete/i,
  );
  assert.deepEqual(
    readRailwayS3Config({
      BUCKET: 'staging-media',
      ENDPOINT: 'https://t3.storageapi.dev',
      ACCESS_KEY_ID: 'access-key',
      SECRET_ACCESS_KEY: 'secret-key',
      REGION: 'auto',
    }),
    {
      bucket: 'staging-media',
      endpoint: 'https://t3.storageapi.dev',
      accessKeyId: 'access-key',
      secretAccessKey: 'secret-key',
      region: 'auto',
      uploadLifetimeSeconds: 900,
    },
  );
});

test('Railway S3 adapter signs private uploads and delegates object checks/deletes', async () => {
  const config = {
    bucket: 'staging-media',
    endpoint: 'https://t3.storageapi.dev',
    accessKeyId: 'access-key',
    secretAccessKey: 'secret-key',
    region: 'auto',
    uploadLifetimeSeconds: 900,
  };
  const signingStore = new RailwayS3ObjectStore(config);
  const upload = await signingStore.createUpload({
    objectKey: 'media/account/asset',
    mimeType: 'image/jpeg',
    byteSize: 100,
  });
  assert.match(upload.uploadUrl, /^https:\/\/t3\.storageapi\.dev/);

  const sent: string[] = [];
  const client = {
    send: async (command: { constructor: { name: string } }) => {
      sent.push(command.constructor.name);
      return {};
    },
  } as unknown as S3Client;
  const store = new RailwayS3ObjectStore(config, client);
  assert.equal(
    await store.hasObject({ objectKey: 'media/account/asset' }),
    true,
  );
  await store.deleteObject({ objectKey: 'media/account/asset' });
  assert.deepEqual(sent, ['HeadObjectCommand', 'DeleteObjectCommand']);
});
