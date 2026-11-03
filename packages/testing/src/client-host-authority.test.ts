import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import type { ComponentType } from 'react';
import { chromium } from 'playwright';
import { renderToStaticMarkup } from 'react-dom/server';

const repository = fileURLToPath(new URL('../../../', import.meta.url));

async function loadModule(path: string): Promise<Record<string, unknown>> {
  return (await import(path)) as Record<string, unknown>;
}

test('successful /me response resolves the canonical authenticated identity', async () => {
  const module = await loadModule(
    '../../../apps/client/src/platform/identity.js',
  );
  const resolveSession = module.resolveSession as Function;
  const createBearerSessionTransport =
    module.createBearerSessionTransport as Function;
  const identity = await resolveSession(
    createBearerSessionTransport({
      apiOrigin: 'https://api.example.test/',
      getBearerToken: () => 'session-token',
      fetcher: async (input: RequestInfo | URL, init?: RequestInit) => {
        assert.equal(input, 'https://api.example.test/me');
        assert.equal(
          init?.headers && new Headers(init.headers).get('Authorization'),
          'Bearer session-token',
        );
        return new Response(
          JSON.stringify({
            accountId: 'acct-001',
            sessionId: 'sess-001',
            host: 'web',
            capabilities: ['profile:read'],
          }),
          { status: 200 },
        );
      },
    }),
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
  const guest = await resolveSession({
    request: async () => new Response('', { status: 401 }),
  });
  const expired = await resolveSession(
    { request: async () => new Response('', { status: 401 }) },
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
  const unavailable = await resolveSession({
    request: async () => new Response('', { status: 503 }),
  });
  const offline = await resolveSession({
    request: async () => {
      throw new TypeError('fetch failed');
    },
  });
  assert.deepEqual(unavailable, { status: 'unavailable' });
  assert.deepEqual(offline, { status: 'offline' });
});

test('malformed canonical principals never become authenticated', async () => {
  const module = await loadModule(
    '../../../apps/client/src/platform/identity.js',
  );
  const resolveSession = module.resolveSession as Function;
  const denied = await resolveSession({
    request: async () =>
      new Response(
        JSON.stringify({
          accountId: 'acct 001',
          sessionId: 'sess-001',
          host: 'web',
          capabilities: ['profile:read'],
        }),
        { status: 200 },
      ),
  });
  assert.deepEqual(denied, { status: 'denied' });
});

test('session controller deduplicates only in-flight loading and revalidates after completion', async () => {
  const module = await loadModule(
    '../../../apps/client/src/platform/identity.js',
  );
  const createSessionController = module.createSessionController as Function;
  let calls = 0;
  const responses = [
    new Response('', { status: 401 }),
    new Response('', { status: 401 }),
  ];
  const controller = createSessionController({
    request: async () => {
      calls += 1;
      return responses.shift() ?? new Response('', { status: 401 });
    },
  });
  await Promise.all([controller.load(), controller.load()]);
  await controller.refresh('guest');
  assert.equal(calls, 2);
});

test('session controller performs one request per load and revalidation cycle', async () => {
  const module = await loadModule(
    '../../../apps/client/src/platform/identity.js',
  );
  const createSessionController = module.createSessionController as Function;
  let calls = 0;
  const controller = createSessionController({
    request: async () => {
      calls += 1;
      return new Response('', { status: 401 });
    },
  });
  await controller.load();
  await controller.refresh('guest');
  assert.equal(calls, 2);
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
  assert.match(markup, /Guest session/);
  assert.match(markup, /Home content is not yet available/);
  assert.doesNotMatch(markup, /balance|messages|transaction|successfully/i);
});

test('global controls are truthful disabled controls with a real bell icon', async () => {
  const module = await loadModule('../../../apps/client/src/App.js');
  const App = module.App as ComponentType;
  const markup = renderToStaticMarkup(createElement(App));
  assert.match(markup, /aria-label="Notifications unavailable"/);
  assert.match(markup, /disabled=""/);
  assert.match(markup, /<svg[^>]+aria-hidden="true"/);
  assert.doesNotMatch(
    markup,
    /♧|Find your next good thing|Server-authoritative identity/,
  );
});

test('App renders each non-authenticated session state distinctly', async () => {
  const module = await loadModule('../../../apps/client/src/App.js');
  const App = module.App as ComponentType<{ initialSession: unknown }>;
  for (const status of [
    'loading',
    'guest',
    'expired',
    'denied',
    'offline',
    'unavailable',
  ]) {
    const markup = renderToStaticMarkup(
      createElement(App, { initialSession: { status } }),
    );
    assert.match(
      markup,
      new RegExp(`<h2[^>]*>${status[0].toUpperCase()}${status.slice(1)}<`),
    );
  }
});

test('browser App loads its truthful unavailable state and navigates the live shell', async () => {
  const port = 4178;
  const server = spawn(
    process.execPath,
    [
      `${repository}/node_modules/vite/dist/node/cli.js`,
      '--host',
      '127.0.0.1',
      '--port',
      String(port),
      '--strictPort',
    ],
    { cwd: `${repository}/apps/client`, stdio: 'ignore' },
  );
  const url = `http://127.0.0.1:${port}/`;
  try {
    for (let attempt = 0; attempt < 30; attempt += 1) {
      try {
        if ((await fetch(url)).ok) break;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
    const browser = await chromium.launch({ headless: true });
    try {
      const page = await browser.newPage();
      await page.goto(url);
      await page.getByRole('heading', { name: 'Unavailable' }).waitFor();
      await page.getByRole('button', { name: 'Explore' }).click();
      assert.equal(
        await page.locator('#destination-title').textContent(),
        'Explore',
      );
      assert.equal(
        await page
          .getByRole('button', { name: 'Notifications unavailable' })
          .isDisabled(),
        true,
      );
    } finally {
      await browser.close();
    }
  } finally {
    server.kill();
  }
});

test('Telegram host seam exposes capability information without minting identity', async () => {
  const module = await loadModule('../../../apps/client/src/platform/host.js');
  const createHostAdapter = module.createHostAdapter as Function;
  const adapter = createHostAdapter({ Telegram: { WebApp: {} } });
  assert.equal(adapter.identityAuthority, 'server-session');
  assert.equal('accountId' in adapter, false);
  assert.equal('sessionId' in adapter, false);
});
