import React from 'react';
import { Icon } from './Icon.js';
import {
  Panel,
  Unavailable,
  UnavailableAction,
  ViewSwitcher,
} from './Surface.js';

export function HomePage({ onExplore }: { onExplore: () => void }) {
  return (
    <div className="home-page page-stack">
      <h1 className="sr-only" tabIndex={-1}>
        Home
      </h1>
      <div className="home-context">
        <button type="button" className="area-link" onClick={onExplore}>
          <Icon name="pin" />
          Choose Area...
        </button>
        <button
          type="button"
          className="search-link"
          onClick={onExplore}
          aria-label="Search Explore"
        >
          <Icon name="search" />
        </button>
        <span className="visitor-chip">
          Profile unavailable <span aria-hidden="true">🎒</span>
        </span>
      </div>
      <section>
        <h2 className="section-title">Vibe Check-ins</h2>
        <div className="checkin-row">
          <div className="current-vibe">
            <span>Current Vibe</span>
            <strong>Unavailable</strong>
          </div>
          <Unavailable subject="Check-ins" />
        </div>
      </section>
      <Panel title="Flash Event Alert!" icon="zap" tone="rose-panel">
        <Unavailable subject="Secrets board alerts" />
        <UnavailableAction icon="zap">Spawn Flash</UnavailableAction>
      </Panel>
      <section aria-label="Home discovery feed">
        <ViewSwitcher
          label="Home feeds"
          options={['My Network', 'Local Vibes', 'For You']}
          className="feed-switcher"
        >
          {(selected) => <Unavailable subject={`${selected} feed`} />}
        </ViewSwitcher>
        <p className="availability-note">Home content is not yet available.</p>
      </section>
      <Panel title="Live Activities" icon="zap">
        <ViewSwitcher label="Activity views" options={['Live Now', 'Upcoming']}>
          {(selected) => <Unavailable subject={`${selected} activities`} />}
        </ViewSwitcher>
        <UnavailableAction>Host Activity</UnavailableAction>
      </Panel>
      <Panel title="Live Events" icon="users">
        <ViewSwitcher label="Event views" options={['Live Now', 'Upcoming']}>
          {(selected) => <Unavailable subject={`${selected} events`} />}
        </ViewSwitcher>
        <UnavailableAction>Host Event</UnavailableAction>
      </Panel>
      <div className="quest-grid">
        <Panel title="Vibe Feed" icon="zap" tone="amber-panel">
          <Unavailable subject="Daily streak and rewards" />
          <UnavailableAction>Claim</UnavailableAction>
        </Panel>
        <Panel title="Vibe Trails" icon="compass" tone="trail-panel">
          <p className="eyebrow">Multi-Stop Day Trips</p>
          <p>
            Curate and follow day-long circuits, adopt routes from fellow
            travelers, and launch navigation into Google Maps.
          </p>
          <button
            type="button"
            className="feature-action trail-link"
            onClick={onExplore}
          >
            <Icon name="compass" />
            Discover Local Trails &amp; Radar <span aria-hidden="true">→</span>
          </button>
        </Panel>
      </div>
      <Panel
        title="Curated Heritage Coordinates"
        icon="sparkles"
        tone="green-panel"
      >
        <Unavailable subject="Heritage discoveries" />
      </Panel>
      <Panel title="Local Gems" icon="pin">
        <Unavailable subject="Local gems" />
      </Panel>
      <Panel title="VIBE Guide Handbook" icon="sparkles" tone="purple-panel">
        <p>
          Community principles, slow-restoration culture &amp; Voyager Compass
        </p>
        <UnavailableAction>Open</UnavailableAction>
      </Panel>
    </div>
  );
}
