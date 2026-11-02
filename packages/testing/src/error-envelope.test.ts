import assert from 'node:assert/strict';
import test from 'node:test';

async function loadErrorModule(): Promise<Record<string, unknown> | undefined> {
  try {
    return (await import('../../contracts/src/error-envelope.js')) as Record<
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

test('error envelope serializes one versioned safe public shape', async () => {
  const module = await loadErrorModule();
  assert.ok(module, 'error envelope module must exist');

  const createErrorEnvelope = module.createErrorEnvelope as (
    category: string,
    message: string,
    status: number,
    details?: unknown,
  ) => unknown;
  assert.deepEqual(
    createErrorEnvelope('VALIDATION_ERROR', 'Request validation failed', 400),
    {
      version: 1,
      error: {
        category: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        status: 400,
      },
    },
  );
});

test('error envelope never serializes sensitive implementation details', async () => {
  const module = await loadErrorModule();
  assert.ok(module, 'error envelope module must exist');

  const createErrorEnvelope = module.createErrorEnvelope as (
    category: string,
    message: string,
    status: number,
    details?: unknown,
  ) => unknown;
  const envelope = JSON.stringify(
    createErrorEnvelope('INTERNAL_ERROR', 'Unexpected server error', 500, {
      stack: 'secret stack',
      password: 'secret password',
      token: 'secret token',
    }),
  );
  assert.equal(envelope.includes('secret'), false);
  assert.equal(envelope.includes('stack'), false);
});
