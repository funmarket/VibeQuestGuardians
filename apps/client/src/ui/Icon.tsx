import React from 'react';

export type IconName =
  | 'home'
  | 'compass'
  | 'heart'
  | 'users'
  | 'bitcoin'
  | 'pin'
  | 'bell'
  | 'user'
  | 'search'
  | 'camera'
  | 'zap'
  | 'clock'
  | 'message'
  | 'sparkles'
  | 'target'
  | 'send'
  | 'receive';

// Presentation-only marks; no icon package or legacy runtime is required.
export function Icon({ name }: { name: IconName }) {
  let drawing: React.ReactNode;
  switch (name) {
    case 'home':
      drawing = (
        <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-8H9v8H4a1 1 0 0 1-1-1Z" />
      );
      break;
    case 'compass':
      drawing = (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m16 8-3 5-5 3 3-5Z" />
        </>
      );
      break;
    case 'heart':
      drawing = (
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
      );
      break;
    case 'users':
      drawing = (
        <>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M21 21v-3a6 6 0 0 0-3-5" />
        </>
      );
      break;
    case 'bitcoin':
      drawing = (
        <path d="m8 3-2 18M13 3l-2 18M5 6h9a4 4 0 0 1 0 8H7m0-1h8a4 4 0 0 1 0 8H4" />
      );
      break;
    case 'pin':
      drawing = (
        <>
          <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </>
      );
      break;
    case 'bell':
      drawing = (
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      );
      break;
    case 'user':
      drawing = (
        <>
          <circle cx="12" cy="8" r="3" />
          <path d="M5 21a7 7 0 0 1 14 0" />
        </>
      );
      break;
    case 'search':
      drawing = (
        <>
          <circle cx="10" cy="10" r="7" />
          <path d="m15 15 6 6" />
        </>
      );
      break;
    case 'camera':
      drawing = (
        <>
          <path d="M3 7h4l2-3h6l2 3h4v13H3Z" />
          <circle cx="12" cy="13" r="4" />
        </>
      );
      break;
    case 'zap':
      drawing = <path d="m13 2-9 12h7l-1 8 10-12h-7Z" />;
      break;
    case 'clock':
      drawing = (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 6v6l4 2" />
        </>
      );
      break;
    case 'message':
      drawing = <path d="M21 11a9 9 0 0 1-9 9H3l2-5a9 9 0 1 1 16-4Z" />;
      break;
    case 'sparkles':
      drawing = (
        <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5ZM20 2v4m-2-2h4" />
      );
      break;
    case 'target':
      drawing = (
        <>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1" />
        </>
      );
      break;
    case 'send':
      drawing = <path d="m22 2-7 20-4-9-9-4Zm0 0L11 13" />;
      break;
    case 'receive':
      drawing = <path d="M19 5 5 19M5 5v14h14" />;
      break;
  }
  return (
    <svg
      className="ui-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {drawing}
    </svg>
  );
}
