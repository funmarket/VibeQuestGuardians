import React, { useState } from 'react';
import { Icon, type IconName } from './Icon.js';

export function Unavailable({ subject }: { subject: string }) {
  return <p className="unavailable-state">{subject} unavailable.</p>;
}

export function UnavailableAction({
  children,
  icon,
  className = '',
}: {
  children: React.ReactNode;
  icon?: IconName;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`feature-action ${className}`}
      disabled
      title="Unavailable — this service is not connected"
    >
      {icon ? <Icon name={icon} /> : null}
      {children}
      <span className="sr-only"> — unavailable</span>
    </button>
  );
}

export function Panel({
  title,
  icon,
  tone = '',
  children,
}: {
  title: string;
  icon?: IconName;
  tone?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`feature-panel ${tone}`}>
      <h2 className="section-title">
        {icon ? <Icon name={icon} /> : null}
        {title}
      </h2>
      {children}
    </section>
  );
}

// These buttons change only the visible view, never membership or business state.
export function ViewSwitcher({
  label,
  options,
  children,
  className = '',
}: {
  label: string;
  options: readonly string[];
  children: (selected: string) => React.ReactNode;
  className?: string;
}) {
  const [selected, setSelected] = useState(options[0]);
  return (
    <div className={`view-switcher ${className}`}>
      <div className="view-buttons" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            type="button"
            key={option}
            aria-pressed={selected === option}
            onClick={() => setSelected(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="view-content">{children(selected)}</div>
    </div>
  );
}
