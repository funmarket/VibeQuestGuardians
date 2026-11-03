import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import type { ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

async function loadModule(path: string): Promise<Record<string, unknown>> {
  return (await import(path)) as Record<string, unknown>;
}

test('successful /me response resolves the canonical authenticated identity', async () => {
  const module = await loadModule(
    '../../../apps/client/src/platform/identity.js',
  );
  const resolveSession = module.resolveSession as Function;
  const identity = await resolveSession(
    async () =>
      new Response(
        JSON.stringify({
          accountId: 'acct-001',
          sessionId: 'sess-001',
          host: 'web',
          capabilities: ['profile:read'],
        }),
        { status: 200 },
      ),
  );
  assert.deepEqual(identity, {
    status: 'authenticated',
    principal: {
      accountId: 'acct-001',
      sessionId: 'sess-001',
      host: 'web',
      capabilities: ['profile:read'],
    },
  });
});

test('missing, expired, or revoked session remains truthful and removes stale auth', async () => {
  const module = await loadModule(
    '../../../apps/client/src/platform/identity.js',
  );
  const resolveSession = module.resolveSession as Function;
  const guest = await resolveSession(
    async () => new Response('', { status: 401 }),
  );
  const expired = await resolveSession(
    async () => new Response('', { status: 401 }),
    { previous: 'authenticated' },
  );
  assert.deepEqual(guest, { status: 'guest' });
  assert.deepEqual(expired, { status: 'expired' });
});

test('failed /me responses distinguish unavailable dependencies and never promote a guest', async () => {
  const module = await loadModule(
    '../../../apps/client/src/platform/identity.js',
  );
  const resolveSession = module.resolveSession as Function;
  const unavailable = await resolveSession(
    async () => new Response('', { status: 503 }),
  );
  const offline = await resolveSession(async () => {
    throw new TypeError('fetch failed');
  });
  assert.deepEqual(unavailable, { status: 'unavailable' });
  assert.deepEqual(offline, { status: 'offline' });
});

test('session resolution performs one request and uses browser credentials', async () => {
  const module = await loadModule(
    '../../../apps/client/src/platform/identity.js',
  );
  const resolveSession = module.resolveSession as Function;
  let calls = 0;
  let input: RequestInfo | URL | undefined;
  let init: RequestInit | undefined;
  await resolveSession(
    async (requestInput: RequestInfo | URL, requestInit?: RequestInit) => {
      calls += 1;
      input = requestInput;
      init = requestInit;
      return new Response('', { status: 401 });
    },
  );
  assert.equal(calls, 1);
  assert.equal(input, '/me');
  assert.equal(init?.credentials, 'include');
});

test('five root destinations have equal navigation semantics and Share is not elevated', async () => {
  const module = await loadModule('../../../apps/client/src/App.js');
  const App = module.App as ComponentType;
  const markup = renderToStaticMarkup(createElement(App));
  for (const destination of ['Home', 'Explore', 'Share', 'Vibe', 'Purse']) {
    assert.match(markup, new RegExp(`>${destination}<`));
  }
  assert.match(markup, /data-destination="Share"/);
  assert.doesNotMatch(markup, /floating|elevated/);
});

test('guest shell denies protected actions and does not invent business success', async () => {
  const module = await loadModule('../../../apps/client/src/App.js');
  const App = module.App as ComponentType<{ initialSession: unknown }>;
  const markup = renderToStaticMarkup(
    createElement(App, { initialSession: { status: 'guest' } }),
  );
  assert.match(markup, /Sign-in is unavailable/);
  assert.match(markup, /authoritative service is available/);
  assert.doesNotMatch(markup, /balance|messages|transaction|successfully/i);
});

test('Telegram host seam exposes capability information without minting identity', async () => {
  const module = await loadModule('../../../apps/client/src/platform/host.js');
  const createHostAdapter = module.createHostAdapter as Function;
  const adapter = createHostAdapter({ Telegram: { WebApp: {} } });
  assert.equal(adapter.identityAuthority, 'server-session');
  assert.equal('accountId' in adapter, false);
  assert.equal('sessionId' in adapter, false);
});
