import assert from 'node:assert/strict';
import test from 'node:test';

import {
  assertFixtureEnvironment,
  assertFixtureNamespace,
} from '../../../packages/contracts/src/d02-fixtures.js';
import { assertMediaUploadRequest } from '../../../packages/contracts/src/d13-media.js';

test('D02 rejects production fixture loading and invalid namespaces', () => {
  assert.throws(() => assertFixtureEnvironment('production'));
  assert.throws(() => assertFixtureNamespace('not valid'));
  assert.doesNotThrow(() => assertFixtureEnvironment('test'));
  assert.doesNotThrow(() => assertFixtureNamespace('s02-4-demo'));
});

test('D13 rejects incomplete or invalid media ownership metadata', () => {
  assert.throws(() =>
    assertMediaUploadRequest({
      ownerAccountId: '',
      purpose: 'profile',
      mimeType: 'image/jpeg',
      byteSize: 10,
      idempotencyKey: 'upload-1',
    }),
  );
  assert.throws(() =>
    assertMediaUploadRequest({
      ownerAccountId: 'account-1',
      purpose: 'profile',
      mimeType: 'invalid',
      byteSize: 10,
      idempotencyKey: 'upload-1',
    }),
  );
  assert.doesNotThrow(() =>
    assertMediaUploadRequest({
      ownerAccountId: 'account-1',
      purpose: 'profile',
      mimeType: 'image/jpeg',
      byteSize: 10,
      idempotencyKey: 'upload-1',
    }),
  );
});
