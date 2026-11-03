import React, { useEffect, useMemo, useState } from 'react';
import {
  loadSessionOnce,
  type ClientSession,
  type SessionFetcher,
} from './platform/identity.js';
import { createHostAdapter } from './platform/host.js';
import { resolvePlatformPreferences } from './platform/preferences.js';

const destinations = ['Home', 'Explore', 'Share', 'Vibe', 'Purse'] as const;
type Destination = (typeof destinations)[number];

export interface AppProps {
  initialSession?: ClientSession;
  sessionFetcher?: SessionFetcher;
}

function sessionMessage(session: ClientSession): string {
  switch (session.status) {
    case 'loading':
      return 'Checking your server-authorized session…';
    case 'authenticated':
      return `Signed in as ${session.principal.accountId}.`;
    case 'guest':
      return 'You are browsing as a guest. Sign-in is unavailable in this client slice.';
    case 'expired':
      return 'Your session expired or was revoked. Sign-in is unavailable in this client slice.';
    case 'denied':
      return 'Your session was not accepted by the server. Protected actions remain unavailable.';
    case 'offline':
      return 'The identity service could not be reached. Protected actions remain unavailable.';
    case 'unavailable':
      return 'The identity service is unavailable. Protected actions remain unavailable.';
  }
}

function destinationMessage(destination: Destination): string {
  return destination === 'Home'
    ? 'Public shell is ready. Domain content will appear only when its authoritative service is available.'
    : `${destination} is not yet available in this client slice.`;
}

export function App({ initialSession, sessionFetcher }: AppProps = {}) {
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
  const [session, setSession] = useState<ClientSession>(
    initialSession ?? { status: 'loading' },
  );
  const [destination, setDestination] = useState<Destination>('Home');

  useEffect(() => {
    document.documentElement.dir = preferences.direction;
    document.documentElement.dataset.host = host.kind;
    document.documentElement.dataset.theme = preferences.theme;
    document.documentElement.dataset.textScale = preferences.textScale;
  }, [host.kind, preferences]);

  useEffect(() => {
    if (initialSession) return;
    let active = true;
    void loadSessionOnce(sessionFetcher).then((nextSession) => {
      if (active) setSession(nextSession);
    });
    return () => {
      active = false;
    };
  }, [initialSession, sessionFetcher]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-kicker">VibeQuest</p>
          <h1>Find your next good thing.</h1>
        </div>
        <div className="header-actions" aria-label="Global actions">
          <button
            type="button"
            className="icon-button"
            aria-label="Notifications"
          >
            ♧
          </button>
          <button
            type="button"
            className="profile-button"
            aria-label="Profile and settings"
          >
            {session.status === 'authenticated' ? 'Profile' : 'Guest'}
          </button>
        </div>
      </header>

      <main className="app-content" aria-live="polite">
        <section className="identity-card" aria-labelledby="identity-title">
          <p className="app-kicker">Server-authoritative identity</p>
          <h2 id="identity-title">
            {session.status === 'authenticated'
              ? 'Authenticated'
              : session.status === 'loading'
                ? 'Loading'
                : 'Guest access'}
          </h2>
          <p>{sessionMessage(session)}</p>
          {session.status !== 'authenticated' &&
          session.status !== 'loading' ? (
            <p className="protected-note">
              Protected writes are denied until the server authorizes an
              identity.
            </p>
          ) : null}
        </section>

        <section
          className="destination-panel"
          aria-labelledby="destination-title"
        >
          <p className="app-kicker">Destination</p>
          <h2 id="destination-title">{destination}</h2>
          <p>{destinationMessage(destination)}</p>
        </section>
      </main>

      <nav className="root-navigation" aria-label="Primary navigation">
        {destinations.map((item) => (
          <button
            key={item}
            type="button"
            className="destination-button"
            data-destination={item}
            aria-current={destination === item ? 'page' : undefined}
            onClick={() => setDestination(item)}
          >
            {item === 'Share' ? (
              <span className="share-heart" aria-hidden="true">
                ♥
              </span>
            ) : null}
            {item}
          </button>
        ))}
      </nav>
    </div>
  );
}
