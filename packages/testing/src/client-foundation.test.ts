import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createElement } from 'react';
import type { ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

async function loadModule(
  path: string,
): Promise<Record<string, unknown> | undefined> {
  try {
    return (await import(path)) as Record<string, unknown>;
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

test('Client React entry renders a neutral accessible foundation surface', async () => {
  const module = await loadModule('../../../apps/client/src/App.js');
  assert.ok(module, 'Client App module must exist');
  const App = module.App as ComponentType;
  const markup = renderToStaticMarkup(createElement(App));
  assert.match(markup, /main/);
  assert.match(markup, /aria-live/);
  assert.match(markup, /button/);
});

test('host adapter remains functional without Telegram globals', async () => {
  const module = await loadModule('../../../apps/client/src/platform/host.js');
  assert.ok(module, 'host adapter module must exist');
  const createHostAdapter = module.createHostAdapter as (source?: unknown) => {
    kind: string;
    capabilities: Record<string, boolean>;
  };
  const adapter = createHostAdapter({});
  assert.equal(adapter.kind, 'browser');
  assert.equal(adapter.capabilities.canUseHaptics, false);
  assert.equal(adapter.capabilities.canUseBackButton, false);
});

test('Telegram host capability detection is bounded and truthful', async () => {
  const module = await loadModule('../../../apps/client/src/platform/host.js');
  assert.ok(module, 'host adapter module must exist');
  const createHostAdapter = module.createHostAdapter as (source?: unknown) => {
    kind: string;
    capabilities: Record<string, boolean>;
    language?: string;
  };
  const adapter = createHostAdapter({
    Telegram: {
      WebApp: {
        themeParams: { bg_color: '#000000' },
        initDataUnsafe: { user: { language_code: 'ar' } },
        HapticFeedback: { impactOccurred: () => undefined },
        BackButton: { show: () => undefined, hide: () => undefined },
      },
    },
  });
  assert.equal(adapter.kind, 'telegram');
  assert.equal(adapter.capabilities.canUseHaptics, true);
  assert.equal(adapter.capabilities.canUseBackButton, true);
  assert.equal(adapter.language, 'ar');
});

test('platform preference resolution supports EN/FR/AR, RTL, theme and text scale without persistence', async () => {
  const module = await loadModule(
    '../../../apps/client/src/platform/preferences.js',
  );
  assert.ok(module, 'preference interface module must exist');
  const resolvePlatformPreferences = module.resolvePlatformPreferences as (
    input: unknown,
  ) => {
    language: string;
    direction: string;
    theme: string;
    textScale: string;
  };
  assert.deepEqual(
    resolvePlatformPreferences({
      browserLocale: 'ar-NG',
      systemTheme: 'dark',
      host: { kind: 'browser' },
    }),
    { language: 'ar', direction: 'rtl', theme: 'dark', textScale: 'system' },
  );
  assert.deepEqual(
    resolvePlatformPreferences({
      browserLocale: 'en-US',
      systemTheme: 'light',
      host: { kind: 'browser' },
      userOverrides: { language: 'fr', textScale: 'large' },
    }),
    { language: 'fr', direction: 'ltr', theme: 'light', textScale: 'large' },
  );
});

test('design tokens expose semantic roles, RTL direction and responsive text sizing', async () => {
  const css = await readFile(
    new URL('../../../apps/client/src/styles/tokens.css', import.meta.url),
    'utf8',
  );
  assert.match(css, /--vq-color-canvas/);
  assert.match(css, /--vq-color-focus/);
  assert.match(css, /--vq-space/);
  assert.match(css, /:dir\(rtl\)/);
  assert.match(css, /@media/);
  assert.match(css, /rem/);
});
