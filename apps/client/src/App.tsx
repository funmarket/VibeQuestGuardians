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
import { Shell, type Destination } from './ui/Shell.js';
import { HomePage } from './ui/HomePage.js';
import { ExplorePage } from './ui/ExplorePage.js';
import { SharePage } from './ui/SharePage.js';
import { VibePage } from './ui/VibePage.js';
import { PursePage } from './ui/PursePage.js';

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

function statusTitle(status: SessionStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
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

  return (
    <Shell
      destination={destination}
      onNavigate={setDestination}
      sessionNotice={
        <aside aria-label="Session status">
          <h2>{statusTitle(session.status)}</h2>
          <p role="status" aria-live="polite">
            {sessionMessage(session)}
          </p>
          {session.status === 'unavailable' ? (
            <span className="sr-only">Protected actions are unavailable.</span>
          ) : null}
        </aside>
      }
    >
      {(navigate) => (
        <>
          <section
            data-page="home"
            hidden={destination !== 'Home'}
            aria-label="Home"
          >
            <HomePage onExplore={() => navigate('Explore')} />
          </section>
          <section
            data-page="explore"
            hidden={destination !== 'Explore'}
            aria-label="Explore"
          >
            <ExplorePage />
          </section>
          <section
            data-page="share"
            hidden={destination !== 'Share'}
            aria-label="Share"
          >
            <SharePage />
          </section>
          <section
            data-page="vibe"
            hidden={destination !== 'Vibe'}
            aria-label="Vibe"
          >
            <VibePage />
          </section>
          <section
            data-page="purse"
            hidden={destination !== 'Purse'}
            aria-label="Purse"
          >
            <PursePage />
          </section>
        </>
      )}
    </Shell>
  );
}
