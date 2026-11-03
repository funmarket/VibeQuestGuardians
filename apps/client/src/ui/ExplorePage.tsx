import React from 'react';
import { Icon } from './Icon.js';
import { Panel, Unavailable, UnavailableAction } from './Surface.js';

export function ExplorePage() {
  return (
    <div className="explore-page inset-page page-stack">
      <div className="split-row">
        <span className="location-pill" aria-label="Location unavailable">
          <Icon name="pin" />
          Location unavailable
        </span>
        <UnavailableAction icon="zap" className="compact-action">
          Spawn Flash
        </UnavailableAction>
      </div>
      <div className="explore-intro">
        <h1 tabIndex={-1}>Explore Local</h1>
        <p>Discover amazing local businesses and hidden gems</p>
        <div className="community-badges">
          <span>🗺️ Community First</span>
          <span>🏅 Small Business</span>
        </div>
      </div>
      <div className="search-field">
        <Icon name="search" />
        <input
          type="search"
          aria-label="Search regional vibes — unavailable"
          placeholder="Search regional vibes"
          disabled
        />
      </div>
      <Unavailable subject="Search and location" />
      <Panel title="Flash Event Alert!" icon="zap" tone="rose-panel">
        <Unavailable subject="Secrets board alerts" />
      </Panel>
      <section className="map-unavailable" aria-label="Venue map unavailable">
        <Icon name="pin" />
        <Unavailable subject="Venue map" />
      </section>
      <Panel title="Vibe Trails & Tours" icon="compass" tone="trail-panel">
        <Unavailable subject="Trails and tours" />
        <div className="action-row">
          <UnavailableAction>Create Trail</UnavailableAction>
          <UnavailableAction>Create Tour</UnavailableAction>
        </div>
      </Panel>
      <Panel title="Discovery Radar" icon="target" tone="green-panel">
        <Unavailable subject="Radar charge and discoveries" />
        <UnavailableAction>PING for Discoveries</UnavailableAction>
      </Panel>
      <Panel title="Vibe Guardians" icon="users" tone="purple-panel">
        <Unavailable subject="Guardian directory" />
      </Panel>
      <Panel title="Local Places" icon="pin">
        <Unavailable subject="Venue results" />
      </Panel>
      <section className="page-stack">
        <h2 className="section-title categories-title">Categories</h2>
        <div className="categories-grid">
          {[
            '🍽️ Food & Drink',
            '🎵 Music & Arts',
            '🏛️ Culture',
            '🌙 Nightlife',
            '☕ Cafés',
            '🛍️ Shopping',
          ].map((category) => (
            <UnavailableAction key={category}>{category}</UnavailableAction>
          ))}
        </div>
      </section>
      <Panel title="Vibe suggestions" icon="sparkles">
        <Unavailable subject="Local recommendations and neighborhood matching" />
      </Panel>
    </div>
  );
}
