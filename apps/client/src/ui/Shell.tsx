import React, { useEffect, useRef, useState } from 'react';
import { Icon, type IconName } from './Icon.js';

export const destinations = [
  'Home',
  'Explore',
  'Share',
  'Vibe',
  'Purse',
] as const;
export type Destination = (typeof destinations)[number];

const navigationIcons: Record<Destination, IconName> = {
  Home: 'home',
  Explore: 'compass',
  Share: 'heart',
  Vibe: 'users',
  Purse: 'bitcoin',
};

export function Shell({
  destination,
  onNavigate,
  sessionNotice,
  children,
}: {
  destination: Destination;
  onNavigate: (destination: Destination) => void;
  sessionNotice: React.ReactNode;
  children:
    | React.ReactNode
    | ((navigate: (destination: Destination) => void) => React.ReactNode);
}) {
  const mainRef = useRef<HTMLElement>(null);
  const lastScroll = useRef(0);
  const navigationRequested = useRef(false);
  const [navigationVisible, setNavigationVisible] = useState(true);

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
    lastScroll.current = 0;
    setNavigationVisible(true);
    if (navigationRequested.current) {
      mainRef.current
        ?.querySelector<HTMLElement>('[data-page]:not([hidden]) h1')
        ?.focus({ preventScroll: true });
      navigationRequested.current = false;
    }
  }, [destination]);

  function navigate(next: Destination) {
    if (next === destination) {
      if (mainRef.current) mainRef.current.scrollTop = 0;
      setNavigationVisible(true);
      return;
    }
    navigationRequested.current = true;
    onNavigate(next);
  }

  return (
    <div className="app-shell">
      <div className="shell-ambient" aria-hidden="true" />
      <header className="app-header">
        <button
          type="button"
          className="brand"
          aria-label="VibeQuest home"
          onClick={() => navigate('Home')}
        >
          <span className="brand-mark" aria-hidden="true">
            🤪
          </span>
          <span className="brand-copy">
            <span>
              VIBE<span className="brand-accent">QUEST</span>
            </span>
            <small>Gather &amp; Discover</small>
          </span>
        </button>
        <button
          type="button"
          className="location-pill"
          aria-label="Choose area — location unavailable"
          onClick={() => navigate('Explore')}
        >
          <Icon name="pin" />
          <span>Location unavailable</span>
        </button>
        <div className="header-actions" aria-label="Global actions">
          <button
            type="button"
            className="icon-button"
            aria-label="Notifications unavailable"
            title="Notifications unavailable"
            disabled
          >
            <Icon name="bell" />
          </button>
          <button
            type="button"
            className="profile-button"
            aria-label="Profile and settings unavailable"
            title="Profile and settings unavailable"
            disabled
          >
            <Icon name="user" />
          </button>
        </div>
      </header>
      <div className="session-notice">{sessionNotice}</div>
      <main
        className={`app-content${destination === 'Vibe' ? ' vibe-content' : ''}`}
        ref={mainRef}
        onScroll={(event) => {
          const position = event.currentTarget.scrollTop;
          if (position < 10) setNavigationVisible(true);
          else if (Math.abs(position - lastScroll.current) > 20)
            setNavigationVisible(position < lastScroll.current);
          if (position < 10 || Math.abs(position - lastScroll.current) > 20)
            lastScroll.current = position;
        }}
      >
        {typeof children === 'function' ? children(navigate) : children}
      </main>
      <nav
        className="root-navigation"
        aria-label="Primary navigation"
        data-visible={navigationVisible}
      >
        {destinations.map((item) => (
          <button
            key={item}
            type="button"
            className="destination-button"
            data-destination={item}
            aria-current={destination === item ? 'page' : undefined}
            onClick={() => navigate(item)}
          >
            <Icon name={navigationIcons[item]} />
            <span>{item}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
