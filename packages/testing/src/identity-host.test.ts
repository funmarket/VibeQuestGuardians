import assert from 'node:assert/strict';
import test from 'node:test';

import {
  IdentityContractError,
  assertCapability,
  assertNotReplayed,
  assertProviderLinkAvailable,
  assertSessionActive,
  parseCanonicalPrincipal,
  resolveHostPrincipal,
  type ReplayGuard,
} from '../../../packages/contracts/src/identity-host.js';

const webPrincipal = {
  accountId: 'account-001',
  sessionId: 'session-001',
  host: 'web' as const,
  capabilities: ['profile:read'],
};

const telegramPrincipal = {
  accountId: 'account-001',
  sessionId: 'session-002',
  host: 'telegram' as const,
  capabilities: ['profile:read'],
};

test('accepts a valid canonical principal', () => {
  assert.deepEqual(parseCanonicalPrincipal(webPrincipal), webPrincipal);
});

test('rejects malformed canonical principal data', () => {
  assert.throws(
    () => parseCanonicalPrincipal({ accountId: '', sessionId: 'session-001' }),
    (error: unknown) =>
      error instanceof IdentityContractError &&
      error.code === 'INVALID_CONTEXT',
  );
});

test('resolves a verified Web host assertion through the canonical principal', () => {
  assert.deepEqual(
    resolveHostPrincipal({
      kind: 'web',
      principal: webPrincipal,
      sessionId: 'session-001',
      verification: { status: 'verified', method: 'session' },
    }),
    webPrincipal,
  );
});

test('rejects a Telegram assertion that bypasses canonical principal validation', () => {
  assert.throws(
    () =>
      resolveHostPrincipal({
        kind: 'telegram',
        principal: { ...telegramPrincipal, accountId: '' },
        initData: 'signed-init-data',
        replayKey: 'telegram-update-001',
        verification: { status: 'verified', method: 'telegram-init-data' },
      }),
    (error: unknown) =>
      error instanceof IdentityContractError &&
      error.code === 'INVALID_CONTEXT',
  );
});

test('fails closed when Telegram verification data is missing or invalid', () => {
  assert.throws(
    () =>
      resolveHostPrincipal({
        kind: 'telegram',
        principal: telegramPrincipal,
        initData: '',
        replayKey: 'telegram-update-001',
        verification: { status: 'unverified', method: 'telegram-init-data' },
      }),
    (error: unknown) =>
      error instanceof IdentityContractError &&
      error.code === 'INVALID_CONTEXT',
  );
});

test('rejects a replayed Telegram assertion through the replay guard boundary', async () => {
  const claimed = new Set<string>();
  const guard: ReplayGuard = {
    claim: (key) => {
      if (claimed.has(key)) return false;
      claimed.add(key);
      return true;
    },
  };

  await assertNotReplayed('telegram-update-001', guard);
  await assert.rejects(
    () => assertNotReplayed('telegram-update-001', guard),
    (error: unknown) =>
      error instanceof IdentityContractError &&
      error.code === 'REPLAYED_CONTEXT',
  );
});

test('rejects expired and revoked sessions', () => {
  assert.throws(
    () =>
      assertSessionActive(
        {
          expiresAt: 1_000,
          revokedAt: null,
        },
        1_001,
      ),
    (error: unknown) =>
      error instanceof IdentityContractError &&
      error.code === 'EXPIRED_SESSION',
  );
  assert.throws(
    () =>
      assertSessionActive(
        {
          expiresAt: 2_000,
          revokedAt: 1_500,
        },
        1_600,
      ),
    (error: unknown) =>
      error instanceof IdentityContractError &&
      error.code === 'REVOKED_SESSION',
  );
});

test('rejects a missing capability', () => {
  assert.throws(
    () => assertCapability(webPrincipal, 'admin:read'),
    (error: unknown) =>
      error instanceof IdentityContractError && error.code === 'UNAUTHORIZED',
  );
});

test('rejects duplicate provider linking', async () => {
  const linked = new Set(['telegram:user-001']);
  await assert.rejects(
    () =>
      assertProviderLinkAvailable('telegram', 'user-001', {
        isLinked: (provider, subject) => linked.has(`${provider}:${subject}`),
      }),
    (error: unknown) =>
      error instanceof IdentityContractError && error.code === 'DUPLICATE_LINK',
  );
});

test('Web and Telegram assertions produce the same canonical principal shape', () => {
  const web = resolveHostPrincipal({
    kind: 'web',
    principal: webPrincipal,
    sessionId: webPrincipal.sessionId,
    verification: { status: 'verified', method: 'session' },
  });
  const telegram = resolveHostPrincipal({
    kind: 'telegram',
    principal: { ...webPrincipal, host: 'telegram' },
    initData: 'signed-init-data',
    replayKey: 'telegram-update-002',
    verification: { status: 'verified', method: 'telegram-init-data' },
  });

  assert.deepEqual(Object.keys(web).sort(), Object.keys(telegram).sort());
  assert.equal(web.accountId, telegram.accountId);
  assert.deepEqual(web.capabilities, telegram.capabilities);
});
