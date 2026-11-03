import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  createSessionController,
  createUnavailableSessionTransport,
  type ClientSession,
  type SessionStatus,
  type SessionTransport,
} from './platform/identity.js';
import { createHostAdapter } from './platform/host.js';
import { resolvePlatformPreferences } from './platform/preferences.js';

const destinations = ['Home', 'Explore', 'Share', 'Vibe', 'Purse'] as const;
type Destination = (typeof destinations)[number];

export interface AppProps {
  initialSession?: ClientSession;
  sessionTransport?: SessionTransport;
}

function sessionMessage(session: ClientSession): string {
  switch (session.status) {
    case 'loading':
      return 'Loading session.';
    case 'authenticated':
      return 'Authenticated.';
    case 'guest':
      return 'Guest session. Protected actions are unavailable.';
    case 'expired':
      return 'Expired session. Protected actions are unavailable.';
    case 'denied':
      return 'Denied session. Protected actions are unavailable.';
    case 'offline':
      return 'Offline. Protected actions are unavailable.';
    case 'unavailable':
      return 'Unavailable session transport.';
  }
}

function destinationMessage(destination: Destination): string {
  return `${destination} content is not yet available.`;
}

function statusTitle(status: SessionStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="8" r="3" />
      <path d="M5 21a7 7 0 0 1 14 0" />
    </svg>
  );
}

export function App({ initialSession, sessionTransport }: AppProps = {}) {
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
  const transport = useMemo(
    () => sessionTransport ?? createUnavailableSessionTransport(),
    [sessionTransport],
  );
  const controller = useMemo(
    () => createSessionController(transport),
    [transport],
  );
  const [session, setSession] = useState<ClientSession>(
    initialSession ?? { status: 'loading' },
  );
  const sessionRef = useRef<ClientSession>(session);
  const [destination, setDestination] = useState<Destination>('Home');

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    document.documentElement.dir = preferences.direction;
    document.documentElement.dataset.host = host.kind;
    document.documentElement.dataset.theme = preferences.theme;
    document.documentElement.dataset.textScale = preferences.textScale;
  }, [host.kind, preferences]);

  useEffect(() => {
    if (initialSession) return;
    let active = true;
    const apply = (nextSession: ClientSession) => {
      if (active) setSession(nextSession);
    };
    void controller.load('loading').then(apply);
    const revalidate = () => {
      void controller.refresh(sessionRef.current.status).then(apply);
    };
    window.addEventListener('focus', revalidate);
    return () => {
      active = false;
      window.removeEventListener('focus', revalidate);
    };
  }, [controller, initialSession]);

  const protectedControlsUnavailable = session.status !== 'authenticated';

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-kicker">VibeQuest</p>
          <h1>VibeQuest</h1>
        </div>
        <div className="header-actions" aria-label="Global actions">
          <button
            type="button"
            className="icon-button"
            aria-label="Notifications unavailable"
            title="Notifications unavailable"
            disabled
          >
            <BellIcon />
          </button>
          <button
            type="button"
            className="profile-button"
            aria-label="Profile and settings unavailable"
            title="Profile and settings unavailable"
            disabled
          >
            <ProfileIcon />
          </button>
        </div>
      </header>

      <main className="app-content">
        <section className="identity-card" aria-labelledby="identity-title">
          <p className="app-kicker">Session</p>
          <h2 id="identity-title">{statusTitle(session.status)}</h2>
          <p role="status" aria-live="polite">
            {sessionMessage(session)}
          </p>
          {protectedControlsUnavailable ? (
            <p className="protected-note">Protected actions are unavailable.</p>
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
