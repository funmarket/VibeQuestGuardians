export type MediaAssetStatus = 'pending' | 'verified' | 'retired';

export interface MediaAssetRecord {
  id: string;
  ownerAccountId: string;
  purpose: string;
  mimeType: string;
  byteSize: number;
  checksum: string | null;
  objectKey: string;
  status: MediaAssetStatus;
  retentionUntil: string | null;
  retiredAt: string | null;
}

export interface MediaUploadRequest {
  ownerAccountId: string;
  purpose: string;
  mimeType: string;
  byteSize: number;
  checksum?: string;
  idempotencyKey: string;
}

export interface MediaObjectStore {
  createUpload(input: {
    objectKey: string;
    mimeType: string;
    byteSize: number;
  }): Promise<{ uploadUrl: string }>;
  hasObject(input: { objectKey: string }): Promise<boolean>;
  deleteObject(input: { objectKey: string }): Promise<void>;
}

export function assertMediaUploadRequest(input: MediaUploadRequest): void {
  if (!input.ownerAccountId || !input.purpose || !input.idempotencyKey) {
    throw new Error('Media ownership, purpose, and idempotency are required');
  }
  if (!/^[-\w.+]+\/[\w.+-]+$/.test(input.mimeType)) {
    throw new Error('Media MIME type is invalid');
  }
  if (!Number.isSafeInteger(input.byteSize) || input.byteSize <= 0) {
    throw new Error('Media byte size is invalid');
  }
}
