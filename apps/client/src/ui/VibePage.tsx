import React from 'react';
import { Icon } from './Icon.js';
import { Unavailable, ViewSwitcher } from './Surface.js';

export function VibePage() {
  return (
    <div className="vibe-page page-stack">
      <h1 className="sr-only" tabIndex={-1}>
        Vibe
      </h1>
      <div className="vibe-share-wrap">
        <button
          type="button"
          id="share-vibe-cta"
          className="vibe-share-cta"
          disabled
          title="Composer unavailable"
        >
          <span className="cta-disc">
            <Icon name="camera" />
          </span>
          <span>Vibe Share</span>
          <span className="cta-disc">
            <Icon name="message" />
          </span>
          <span className="sr-only"> — unavailable</span>
        </button>
      </div>
      <blockquote className="vibe-quote">
        <p>
          “Out beyond ideas of wrongdoing and rightdoing,
          <br />
          there is a field. I’ll meet you there.”
        </p>
        <cite>— Rumi</cite>
      </blockquote>
      <ViewSwitcher
        label="Vibe hub"
        options={['Gossip', 'Drift', 'Vibes', 'Orbit', 'Echo', 'Pulls']}
        className="hub-switcher"
      >
        {(selected) => (
          <section className="hub-panel">
            <h2>{selected}</h2>
            <Unavailable subject={selected} />
          </section>
        )}
      </ViewSwitcher>
    </div>
  );
}
