import { randomUUID } from 'node:crypto';

import type { Pool } from 'pg';

import {
  assertMediaUploadRequest,
  type MediaAssetRecord,
  type MediaObjectStore,
  type MediaUploadRequest,
} from '../../../../packages/contracts/src/d13-media.js';

export interface MediaUploadResult {
  asset: MediaAssetRecord;
  uploadUrl: string;
}

export async function createMediaUpload(
  pool: Pool,
  store: MediaObjectStore,
  input: MediaUploadRequest,
): Promise<MediaUploadResult> {
  assertMediaUploadRequest(input);
  const assetId = randomUUID();
  const objectKey = `media/${input.ownerAccountId}/${assetId}`;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query<MediaAssetRecord>(
      `SELECT id,
              owner_account_id AS "ownerAccountId",
              purpose,
              mime_type AS "mimeType",
              byte_size AS "byteSize",
              checksum,
              object_key AS "objectKey",
              status,
              retention_until AS "retentionUntil",
              retired_at AS "retiredAt"
         FROM vq_d13_media_assets
        WHERE idempotency_key = $1`,
      [input.idempotencyKey],
    );
    if (existing.rows[0]) {
      if (existing.rows[0].ownerAccountId !== input.ownerAccountId) {
        throw new Error('Media idempotency key belongs to another owner');
      }
      const upload = await store.createUpload({
        objectKey: existing.rows[0].objectKey,
        mimeType: existing.rows[0].mimeType,
        byteSize: existing.rows[0].byteSize,
      });
      await client.query('COMMIT');
      return { asset: existing.rows[0], uploadUrl: upload.uploadUrl };
    }

    const upload = await store.createUpload({
      objectKey,
      mimeType: input.mimeType,
      byteSize: input.byteSize,
    });
    const result = await client.query<MediaAssetRecord>(
      `INSERT INTO vq_d13_media_assets
         (id, owner_account_id, purpose, idempotency_key, mime_type,
          byte_size, checksum, object_key, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
       RETURNING id,
                 owner_account_id AS "ownerAccountId",
                 purpose,
                 mime_type AS "mimeType",
                 byte_size AS "byteSize",
                 checksum,
                 object_key AS "objectKey",
                 status,
                 retention_until AS "retentionUntil",
                 retired_at AS "retiredAt"`,
      [
        assetId,
        input.ownerAccountId,
        input.purpose,
        input.idempotencyKey,
        input.mimeType,
        input.byteSize,
        input.checksum ?? null,
        objectKey,
      ],
    );
    await client.query('COMMIT');
    return { asset: result.rows[0], uploadUrl: upload.uploadUrl };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function verifyMediaUpload(
  pool: Pool,
  store: MediaObjectStore,
  assetId: string,
  ownerAccountId: string,
): Promise<MediaAssetRecord> {
  const result = await pool.query<MediaAssetRecord>(
    `SELECT id,
            owner_account_id AS "ownerAccountId",
            purpose,
            mime_type AS "mimeType",
            byte_size AS "byteSize",
            checksum,
            object_key AS "objectKey",
            status,
            retention_until AS "retentionUntil",
            retired_at AS "retiredAt"
       FROM vq_d13_media_assets
      WHERE id = $1 AND owner_account_id = $2`,
    [assetId, ownerAccountId],
  );
  const asset = result.rows[0];
  if (!asset) throw new Error('Media asset is unavailable');
  if (!(await store.hasObject({ objectKey: asset.objectKey }))) {
    throw new Error('Media object is unavailable');
  }
  const updated = await pool.query<MediaAssetRecord>(
    `UPDATE vq_d13_media_assets
        SET status = 'verified', updated_at = now()
      WHERE id = $1
      RETURNING id,
                owner_account_id AS "ownerAccountId",
                purpose,
                mime_type AS "mimeType",
                byte_size AS "byteSize",
                checksum,
                object_key AS "objectKey",
                status,
                retention_until AS "retentionUntil",
                retired_at AS "retiredAt"`,
    [assetId],
  );
  return updated.rows[0];
}
