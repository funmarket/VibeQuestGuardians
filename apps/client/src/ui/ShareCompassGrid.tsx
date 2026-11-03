import React from 'react';
import { Panel, UnavailableAction } from './Surface.js';

// Presentation taxonomy only. Availability and matching need owner read models.
const compassCategories = [
  {
    title: '✨ Vibe Matching',
    tone: 'rose-panel',
    rows: [
      ['✨', 'Interest Circles', 'Find neighbors with matching active vibes'],
      [
        '☕',
        'Spontaneous Coffee',
        'Spontaneous morning/afternoon coffee strolls',
      ],
      ['🎸', 'Shared Flow', 'Exchange creative art and synthesizer loops'],
    ],
  },
  {
    title: '🌍 Spontaneous Gatherings',
    tone: 'green-panel',
    rows: [
      ['🌍', 'Pop-up Meetups', 'Spontaneous local plaza or park meetups'],
      ['🚶', 'Group Walks', 'Explore neighborhood secret lanes together'],
      ['🌳', 'Outdoor Sessions', 'Chill sunset acoustic setups'],
    ],
  },
  {
    title: '🚶 Daily Journeys',
    tone: 'amber-panel',
    rows: [
      ['🚶', 'Coffee Walks', 'Cozy morning strolls matching steps'],
      ['🏞️', 'Local Trails', 'Scenic lookout walks to catch the city fog'],
      ['🌅', 'Sunset Pulse', 'Spontaneous vista gatherings at dusk'],
    ],
  },
  {
    title: '🏖️ Sanctuary Shares',
    tone: 'purple-panel',
    rows: [
      ['🏡', 'Quiet Nooks', 'Peaceful reading spots and city library seats'],
      ['🌆', 'Roof Terraces', 'Secret viewpoint lookouts over the skyline'],
      ['🌿', 'Inner Gardens', 'Inner-city foliage corners and botanical steps'],
    ],
  },
] as const;

export function ShareCompassGrid() {
  return (
    <section className="page-stack" aria-label="Aesthetic Discovery Compass">
      <h2 className="compass-title">Aesthetic Discovery Compass</h2>
      <p className="availability-note">Discovery and matching unavailable.</p>
      <div className="compass-grid">
        {compassCategories.map((category) => (
          <Panel
            key={category.title}
            title={category.title}
            tone={category.tone}
          >
            <span className="compass-badge">Proximity-First</span>
            <ul className="compass-rows">
              {category.rows.map(([icon, name, description]) => (
                <li className="compass-row" key={name}>
                  <div className="compass-row-copy">
                    <span aria-hidden="true">{icon}</span>
                    <div>
                      <h3>{name}</h3>
                      <p>{description}</p>
                      <small>Discovery unavailable</small>
                    </div>
                  </div>
                  <div
                    className="compass-actions"
                    role="group"
                    aria-label={name}
                  >
                    <UnavailableAction className="compass-echo">
                      Echo
                    </UnavailableAction>
                    <UnavailableAction>Circle</UnavailableAction>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </section>
  );
}
