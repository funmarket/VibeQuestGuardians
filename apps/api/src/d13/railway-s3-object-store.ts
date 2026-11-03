import type { S3Client } from '@aws-sdk/client-s3';

import type { MediaObjectStore } from '../../../../packages/contracts/src/d13-media.js';

const defaultUploadLifetimeSeconds = 900;

type AwsS3Module = typeof import('@aws-sdk/client-s3');
type AwsPresignerModule = typeof import('@aws-sdk/s3-request-presigner');

interface AwsResources {
  client: S3Client;
  s3: AwsS3Module;
  presigner: AwsPresignerModule;
}

async function loadAwsResources(
  config: RailwayS3Config,
  providedClient?: S3Client,
): Promise<AwsResources> {
  const [s3, presigner] = await Promise.all([
    import('@aws-sdk/client-s3'),
    import('@aws-sdk/s3-request-presigner'),
  ]);
  return {
    client:
      providedClient ??
      new s3.S3Client({
        endpoint: config.endpoint,
        region: config.region,
        credentials: {
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
        },
        forcePathStyle: false,
      }),
    s3,
    presigner,
  };
}

function isNotFoundObjectError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as {
    name?: unknown;
    $metadata?: { httpStatusCode?: unknown };
  };
  return (
    candidate.name === 'NotFound' || candidate.$metadata?.httpStatusCode === 404
  );
}

export interface RailwayS3Config {
  bucket: string;
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  uploadLifetimeSeconds: number;
}

export function readRailwayS3Config(
  env: NodeJS.ProcessEnv,
): RailwayS3Config | undefined {
  const values = {
    bucket: env.BUCKET,
    endpoint: env.ENDPOINT,
    accessKeyId: env.ACCESS_KEY_ID,
    secretAccessKey: env.SECRET_ACCESS_KEY,
    region: env.REGION,
  };
  const configured = Object.values(values).some(Boolean);
  if (!configured) return undefined;
  if (Object.values(values).some((value) => !value)) {
    throw new Error('Railway media storage configuration is incomplete');
  }
  return {
    bucket: values.bucket!,
    endpoint: values.endpoint!,
    accessKeyId: values.accessKeyId!,
    secretAccessKey: values.secretAccessKey!,
    region: values.region!,
    uploadLifetimeSeconds: defaultUploadLifetimeSeconds,
  };
}

export class RailwayS3ObjectStore implements MediaObjectStore {
  private resourcesPromise: Promise<AwsResources> | undefined;

  constructor(
    private readonly config: RailwayS3Config,
    private readonly providedClient?: S3Client,
  ) {}

  private getResources(): Promise<AwsResources> {
    this.resourcesPromise ??= loadAwsResources(
      this.config,
      this.providedClient,
    );
    return this.resourcesPromise;
  }

  async createUpload(input: {
    objectKey: string;
    mimeType: string;
    byteSize: number;
  }): Promise<{ uploadUrl: string }> {
    const { client, s3, presigner } = await this.getResources();
    const command = new s3.PutObjectCommand({
      Bucket: this.config.bucket,
      Key: input.objectKey,
      ContentType: input.mimeType,
      ContentLength: input.byteSize,
    });
    return {
      uploadUrl: await presigner.getSignedUrl(client, command, {
        expiresIn: this.config.uploadLifetimeSeconds,
      }),
    };
  }

  async hasObject(input: { objectKey: string }): Promise<boolean> {
    const { client, s3 } = await this.getResources();
    try {
      await client.send(
        new s3.HeadObjectCommand({
          Bucket: this.config.bucket,
          Key: input.objectKey,
        }),
      );
      return true;
    } catch (error) {
      if (isNotFoundObjectError(error)) {
        return false;
      }
      throw error;
    }
  }

  async deleteObject(input: { objectKey: string }): Promise<void> {
    const { client, s3 } = await this.getResources();
    await client.send(
      new s3.DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: input.objectKey,
      }),
    );
  }
}

export function createRailwayS3ObjectStore(
  env: NodeJS.ProcessEnv,
): RailwayS3ObjectStore | undefined {
  const config = readRailwayS3Config(env);
  return config ? new RailwayS3ObjectStore(config) : undefined;
}
