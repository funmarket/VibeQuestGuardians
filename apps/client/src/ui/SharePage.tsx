import React from 'react';
import { ShareCompassGrid } from './ShareCompassGrid.js';
import { Panel, Unavailable, UnavailableAction } from './Surface.js';

export function SharePage() {
  return (
    <div className="share-page inset-page page-stack">
      <div className="share-hero page-stack">
        <h1 tabIndex={-1}>Share Good Vibes</h1>
        <p>
          Share the moment. Feel the city together. Right now. Warm, authentic
          human presence recorded in physical proximity.
        </p>
        <div className="camera-features">
          <UnavailableAction icon="camera" className="shot-action">
            <strong>Live Vibe Shot</strong>
            <small>Camera only — no uploads</small>
          </UnavailableAction>
          <UnavailableAction icon="zap" className="check-action">
            <strong>VibeCheck</strong>
            <small>Unavailable</small>
          </UnavailableAction>
          <UnavailableAction icon="clock" className="flash-action">
            <strong>Vibe Flash</strong>
            <small>Unavailable</small>
          </UnavailableAction>
        </div>
      </div>
      <UnavailableAction icon="camera" className="broadcast-action">
        Share Good Vibes
      </UnavailableAction>
      <div
        className="share-filters"
        role="group"
        aria-label="Share filters unavailable"
      >
        {[
          '💖 Pure Heart',
          '🤗 Friendly Spark',
          '🧘 Shared Moments',
          '📍 Nearby Vibes',
          '👥 Communities',
          '➕ Create Community',
        ].map((filter) => (
          <UnavailableAction key={filter}>{filter}</UnavailableAction>
        ))}
      </div>
      <section aria-label="Live spontaneous feed">
        <Unavailable subject="Live spontaneous feed" />
      </section>
      <ShareCompassGrid />
      <Panel
        title="Vibe Circles & Communities"
        icon="users"
        tone="circles-panel"
      >
        <Unavailable subject="Communities and membership" />
        <UnavailableAction>Create</UnavailableAction>
      </Panel>
      <Panel title="Support the Pulse" icon="heart" tone="green-panel">
        <Unavailable subject="Sponsorship" />
        <UnavailableAction>Back this node</UnavailableAction>
      </Panel>
    </div>
  );
}
