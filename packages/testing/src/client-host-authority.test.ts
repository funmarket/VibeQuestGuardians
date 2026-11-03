import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
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
  assert.match(markup, /Protected actions are unavailable/);
  assert.doesNotMatch(markup, /\b\d[\d,]* VQ\b|successfully|@hannibal/i);
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
      await page.emulateMedia({ colorScheme: 'light' });
      const errors: string[] = [];
      const requests: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      page.on('request', (request) => requests.push(request.url()));
      await page.goto(url);
      assert.equal(await page.title(), 'VibeQuest');
      await page.getByRole('heading', { name: 'Unavailable' }).waitFor();
      assert.equal(
        await page
          .locator('html')
          .evaluate((element) => getComputedStyle(element).backgroundColor),
        'rgb(245, 248, 245)',
      );
      const nav = page.getByRole('navigation', { name: 'Primary navigation' });
      assert.equal(await nav.getByRole('button').count(), 5);
      for (const viewport of [
        { width: 1280, height: 720 },
        { width: 1024, height: 768 },
        { width: 390, height: 844 },
      ]) {
        await page.setViewportSize(viewport);
        for (const [destination, heading] of [
          ['Home', 'Home'],
          ['Explore', 'Explore Local'],
          ['Share', 'Share Good Vibes'],
          ['Vibe', 'Vibe'],
          ['Purse', 'Purse'],
        ]) {
          await nav
            .getByRole('button', { name: destination, exact: true })
            .click();
          await page
            .getByRole('heading', { name: heading, exact: true, level: 1 })
            .waitFor();
          assert.equal(await page.locator('[data-page]:visible').count(), 1);
          assert.equal(
            await nav
              .locator('[aria-current="page"]')
              .getAttribute('data-destination'),
            destination,
          );
          assert.equal(
            await page.locator('main').evaluate((element) => element.scrollTop),
            0,
          );
          assert.equal(
            await page
              .locator('.app-shell')
              .evaluate((element) => element.clientWidth <= 448),
            true,
          );
          assert.equal(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
            true,
          );
          assert.equal(
            await page
              .locator(`[data-page="${destination.toLowerCase()}"]`)
              .evaluate(
                (element) => element.scrollWidth <= element.clientWidth,
              ),
            true,
          );
          const share = nav.getByRole('button', { name: 'Share', exact: true });
          // Wait for the reference 200ms navigation transition to settle.
          await page.waitForTimeout(250);
          const scale = await share.evaluate(
            (element) => getComputedStyle(element).transform,
          );
          assert.equal(
            scale,
            destination === 'Share' ? 'matrix(1.1, 0, 0, 1.1, 0, 0)' : 'none',
          );
          await page.screenshot({
            path: join(
              repository,
              '..',
              `vq-s16-${viewport.width}-${destination.toLowerCase()}.png`,
            ),
          });
          await page.locator('main').evaluate((element) => {
            element.scrollTop = element.scrollHeight;
          });
        }
      }
      for (const shortcut of [
        'Choose Area...',
        'Search Explore',
        'Discover Local Trails & Radar',
      ]) {
        await nav.getByRole('button', { name: 'Home', exact: true }).click();
        const button = page.getByRole('button', {
          name: shortcut,
          exact: true,
        });
        await button.focus();
        await page.keyboard.press('Enter');
        await page
          .getByRole('heading', { name: 'Explore Local', exact: true })
          .waitFor();
        assert.equal(
          await page
            .locator('[data-page="explore"] h1')
            .evaluate((element) => element === document.activeElement),
          true,
          `${shortcut} must hand focus to Explore's heading`,
        );
      }
      await nav.getByRole('button', { name: 'Vibe', exact: true }).click();
      await page.getByRole('button', { name: 'Drift', exact: true }).click();
      await page.getByRole('heading', { name: 'Drift', exact: true }).waitFor();
      await page.getByRole('button', { name: 'Pulls', exact: true }).click();
      await page.getByRole('heading', { name: 'Pulls', exact: true }).waitFor();
      await nav.getByRole('button', { name: 'Purse', exact: true }).click();
      await page
        .getByRole('button', { name: 'Marketplace', exact: true })
        .click();
      await page
        .getByRole('heading', { name: 'Marketplace', exact: true })
        .waitFor();
      await page
        .getByRole('button', { name: 'Handshakes', exact: true })
        .click();
      await page
        .getByRole('heading', { name: 'Handshakes', exact: true })
        .waitFor();
      await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
      await page.reload();
      await page.getByRole('heading', { name: 'Unavailable' }).waitFor();
      assert.equal(
        await page.locator('html').getAttribute('data-theme'),
        'system',
      );
      assert.equal(
        await page
          .locator('html')
          .evaluate((element) => getComputedStyle(element).backgroundColor),
        'rgb(14, 15, 17)',
      );
      assert.equal(
        await nav
          .getByRole('button', { name: 'Share', exact: true })
          .evaluate((element) => getComputedStyle(element).transitionDuration),
        '0s',
      );
      await page.screenshot({
        path: join(repository, '..', 'vq-s16-dark-home.png'),
      });
      await page.getByRole('button', { name: 'VibeQuest home' }).focus();
      await page.keyboard.press('Tab');
      assert.equal(
        await page.locator(':focus').getAttribute('aria-label'),
        'Choose area — location unavailable',
      );
      assert.notEqual(
        await page
          .locator(':focus')
          .evaluate((element) => getComputedStyle(element).outlineStyle),
        'none',
      );
      await page.keyboard.press('Enter');
      await page
        .getByRole('heading', { name: 'Explore Local', exact: true })
        .waitFor();
      assert.equal(
        await page
          .locator('[data-page="explore"] h1')
          .evaluate((element) => element === document.activeElement),
        true,
      );
      assert.deepEqual(errors, []);
      assert.equal(
        requests.some((request) =>
          /supabase|firebase|unsplash|\/me\b|\/fixtures\b/.test(request),
        ),
        false,
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

test('full-page destination presentation exposes all five reference pages', async () => {
  const module = await loadModule('../../../apps/client/src/App.js');
  const App = module.App as ComponentType<{ initialSession: unknown }>;
  const markup = renderToStaticMarkup(
    createElement(App, { initialSession: { status: 'guest' } }),
  );

  for (const page of ['home', 'explore', 'share', 'vibe', 'purse']) {
    assert.match(markup, new RegExp(`data-page="${page}"`));
  }
});

test('client presentation does not embed extracted demo authority or browser business state', async () => {
  const source = await readFile(
    new URL('../../../apps/client/src/App.tsx', import.meta.url),
    'utf8',
  );
  assert.doesNotMatch(source, /Hannibal|Dar El Jeld|user_yassine|place_medina/);
  assert.doesNotMatch(source, /localStorage|sessionStorage/);
});

test('reference shell landmarks and full destination sections remain available without domain data', async () => {
  const module = await loadModule('../../../apps/client/src/App.js');
  const App = module.App as ComponentType<{ initialSession: unknown }>;
  const markup = renderToStaticMarkup(
    createElement(App, { initialSession: { status: 'guest' } }),
  );
  for (const landmark of [
    'Gather &amp; Discover',
    'Choose area — location unavailable',
    'Vibe Check-ins',
    'My Network',
    'Local Vibes',
    'For You',
    'Live Activities',
    'Live Events',
    'Vibe Trails',
    'Curated Heritage Coordinates',
    'Local Gems',
    'VIBE Guide Handbook',
    'Explore Local',
    'Discovery Radar',
    'Vibe Guardians',
    'Categories',
    'Live Vibe Shot',
    'VibeCheck',
    'Vibe Flash',
    'Aesthetic Discovery Compass',
    'Vibe Circles &amp; Communities',
    'Support the Pulse',
    'Gossip',
    'Drift',
    'Orbit',
    'Echo',
    'Pulls',
    'Vibe Purse &amp; P2P',
    'Send VQ',
    'Receive',
    'Double-Entry Journal History',
  ])
    assert.ok(
      markup.includes(landmark),
      `Missing reference landmark: ${landmark}`,
    );
  assert.match(markup, /aria-label="Location unavailable"/);
  assert.equal((markup.match(/data-page="/g) ?? []).length, 5);
  assert.equal((markup.match(/ hidden=""/g) ?? []).length, 4);
  assert.doesNotMatch(
    markup,
    /TUNIS|Active Nodes|\d+%|\b\d[\d,]* VQ\b|No ledger transactions yet/,
  );
  assert.ok((markup.match(/unavailable/gi) ?? []).length >= 15);
});

test('all client presentation files reject legacy providers, fixtures and browser authority', async () => {
  const root = join(repository, 'apps/client/src');
  const entries = await readdir(root, { recursive: true });
  for (const entry of entries.filter((entry) => /\.(ts|tsx)$/.test(entry))) {
    const source = await readFile(join(root, entry), 'utf8');
    assert.doesNotMatch(
      source,
      /supabase|firebase|solana|VQgemininew|localStorage|sessionStorage|fixture|seed_|Hannibal|Dar El Jeld|user_yassine|place_medina|Math\.random\(/i,
      entry,
    );
  }
});

test('Share compass preserves category rows and separate unavailable Echo and Circle controls', async () => {
  const module = await loadModule('../../../apps/client/src/ui/SharePage.js');
  const markup = renderToStaticMarkup(
    createElement(module.SharePage as ComponentType),
  );
  const categories = [
    ['Vibe Matching', 'Interest Circles', 'Spontaneous Coffee', 'Shared Flow'],
    [
      'Spontaneous Gatherings',
      'Pop-up Meetups',
      'Group Walks',
      'Outdoor Sessions',
    ],
    ['Daily Journeys', 'Coffee Walks', 'Local Trails', 'Sunset Pulse'],
    ['Sanctuary Shares', 'Quiet Nooks', 'Roof Terraces', 'Inner Gardens'],
  ];
  for (const [category, ...rows] of categories) {
    const card = markup
      .match(/<section[^>]*>[^]*?<\/section>/g)
      ?.find((section) => section.includes(category));
    assert.ok(card, `Missing compass category: ${category}`);
    assert.match(card, /Proximity-First/);
    for (const row of rows) {
      const item = card.match(
        new RegExp(`<li[^>]*>[^]*?${row}[^]*?</li>`),
      )?.[0];
      assert.ok(item, `Missing compass row: ${row}`);
      for (const action of ['Echo', 'Circle']) {
        assert.match(
          item,
          new RegExp(
            `<button[^>]*disabled=""[^>]*>\\s*${action}<span[^>]*> — unavailable</span></button>`,
          ),
        );
      }
      assert.match(item, /unavailable/i);
    }
  }
  assert.doesNotMatch(
    markup,
    /Match Rate|Active Nodes|\d+%|Mission District|Dolores Park|@alex_gold/,
  );
});
