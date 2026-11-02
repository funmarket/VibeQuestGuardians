import assert from 'node:assert/strict';
import test from 'node:test';

async function loadIdentityModule(): Promise<
  Record<string, unknown> | undefined
> {
  try {
    return (await import('../../contracts/src/runtime-identity.js')) as Record<
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

test('runtime identity validates exact provided identity without fallback values', async () => {
  const module = await loadIdentityModule();
  assert.ok(module, 'runtime identity module must exist');

  const parseRuntimeIdentity = module.parseRuntimeIdentity as (
    input: unknown,
  ) => unknown;
  assert.deepEqual(
    parseRuntimeIdentity({
      repository: 'funmarket/VibeQuestGuardians',
      ref: 'vibefoundation',
      commit: 'a'.repeat(40),
      build: 'build-001',
      servingRevision: 'revision-001',
      environment: 'test',
    }),
    {
      repository: 'funmarket/VibeQuestGuardians',
      ref: 'vibefoundation',
      commit: 'a'.repeat(40),
      build: 'build-001',
      servingRevision: 'revision-001',
      environment: 'test',
    },
  );
});

test('runtime identity rejects missing or contradictory values', async () => {
  const module = await loadIdentityModule();
  assert.ok(module, 'runtime identity module must exist');

  const parseRuntimeIdentity = module.parseRuntimeIdentity as (
    input: unknown,
  ) => unknown;
  assert.throws(() => parseRuntimeIdentity({}), /identity/i);
  assert.throws(
    () =>
      parseRuntimeIdentity({
        repository: 'funmarket/VibeQuestGuardians',
        ref: 'vibefoundation',
        commit: 'not-a-commit',
        build: 'build-001',
        servingRevision: 'revision-001',
        environment: 'test',
      }),
    /identity|commit/i,
  );
});
