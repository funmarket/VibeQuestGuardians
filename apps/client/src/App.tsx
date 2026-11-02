import React, { useEffect, useMemo, useState } from 'react';
import { createHostAdapter } from './platform/host.js';
import { resolvePlatformPreferences } from './platform/preferences.js';

export function App() {
  const host = useMemo(() => createHostAdapter(), []);
  const preferences = useMemo(
    () =>
      resolvePlatformPreferences({
        host,
        browserLocale:
          typeof navigator === 'undefined' ? undefined : navigator.language,
        systemTheme:
          typeof matchMedia === 'undefined' ||
          !matchMedia('(prefers-color-scheme: dark)').matches
            ? 'light'
            : 'dark',
      }),
    [host],
  );
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dir = preferences.direction;
    document.documentElement.dataset.host = host.kind;
    document.documentElement.dataset.theme = preferences.theme;
    document.documentElement.dataset.textScale = preferences.textScale;
  }, [host.kind, preferences]);

  return (
    <main className="foundation-shell" aria-labelledby="foundation-title">
      <section className="foundation-panel">
        <p className="foundation-kicker">Engineering foundation</p>
        <h1 id="foundation-title">VibeQuest Client</h1>
        <p className="foundation-copy">
          The Client runtime is mounted. Product destinations and authenticated
          behavior are introduced by later milestones.
        </p>
        <button
          type="button"
          className="foundation-button"
          aria-expanded={detailsOpen}
          aria-controls="host-details"
          onClick={() => setDetailsOpen((open) => !open)}
        >
          {detailsOpen ? 'Hide host capabilities' : 'Inspect host capabilities'}
        </button>
        <div
          id="host-details"
          className="foundation-details"
          hidden={!detailsOpen}
          aria-live="polite"
        >
          <dl>
            <div>
              <dt>Host</dt>
              <dd>{host.kind}</dd>
            </div>
            <div>
              <dt>Language</dt>
              <dd>{preferences.language}</dd>
            </div>
            <div>
              <dt>Direction</dt>
              <dd>{preferences.direction}</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
