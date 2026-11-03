import React from 'react';
import { Icon } from './Icon.js';
import {
  Panel,
  Unavailable,
  UnavailableAction,
  ViewSwitcher,
} from './Surface.js';

export function PursePage() {
  return (
    <div className="purse-page inset-page page-stack">
      <div className="purse-heading">
        <h1 tabIndex={-1}>
          <Icon name="bitcoin" />
          Purse
        </h1>
        <p>My Assets &amp; Local P2P Trading</p>
      </div>
      <div className="purse-dashboard page-stack">
        <div className="purse-intro">
          <h2>Vibe Purse &amp; P2P</h2>
          <p>Reputation ledger, peer marketplace, and handshakes</p>
        </div>
        <ViewSwitcher
          label="Purse views"
          options={['Purse', 'Marketplace', 'Handshakes']}
          className="purse-switcher"
        >
          {(selected) =>
            selected === 'Purse' ? (
              <div className="page-stack">
                <Panel title="Vibe Purse" tone="balance-panel">
                  <p className="balance-value">
                    Unavailable <span>VQ</span>
                  </p>
                  <p>Balance unavailable.</p>
                  <div className="action-row">
                    <UnavailableAction icon="send">Send VQ</UnavailableAction>
                    <UnavailableAction icon="receive">
                      Receive
                    </UnavailableAction>
                  </div>
                </Panel>
                <section>
                  <h3 className="eyebrow">Double-Entry Journal History</h3>
                  <Unavailable subject="Ledger history" />
                </section>
              </div>
            ) : (
              <Panel
                title={selected}
                tone={
                  selected === 'Marketplace' ? 'purple-panel' : 'green-panel'
                }
              >
                <Unavailable
                  subject={
                    selected === 'Marketplace'
                      ? 'Marketplace listings and deals'
                      : 'Handshake agreements'
                  }
                />
              </Panel>
            )
          }
        </ViewSwitcher>
      </div>
    </div>
  );
}
