export type HostKind = 'browser' | 'telegram';
export type HostTheme = 'system' | 'light' | 'dark';

export interface HostCapabilities {
  canUseHaptics: boolean;
  canUseBackButton: boolean;
  canReadTheme: boolean;
  canReadLanguage: boolean;
}

export interface HostAdapter {
  kind: HostKind;
  identityAuthority: 'server-session';
  capabilities: HostCapabilities;
  theme: HostTheme;
  language?: string;
  setBackButtonVisible: (visible: boolean) => boolean;
  triggerHaptic: (kind: 'light' | 'medium' | 'heavy') => boolean;
}

interface TelegramWebApp {
  themeParams?: Record<string, unknown>;
  initDataUnsafe?: { user?: { language_code?: unknown } };
  HapticFeedback?: { impactOccurred?: (kind: string) => void };
  BackButton?: { show?: () => void; hide?: () => void };
}

function readTelegramWebApp(source: unknown): TelegramWebApp | undefined {
  if (typeof source !== 'object' || source === null) return undefined;
  const telegram = (source as { Telegram?: unknown }).Telegram;
  if (typeof telegram !== 'object' || telegram === null) return undefined;
  const webApp = (telegram as { WebApp?: unknown }).WebApp;
  return typeof webApp === 'object' && webApp !== null
    ? (webApp as TelegramWebApp)
    : undefined;
}

function hasFunction(value: unknown, key: string): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Record<string, unknown>)[key] === 'function'
  );
}

export function createHostAdapter(source: unknown = globalThis): HostAdapter {
  const webApp = readTelegramWebApp(source);
  if (!webApp) {
    return {
      kind: 'browser',
      identityAuthority: 'server-session',
      capabilities: {
        canUseHaptics: false,
        canUseBackButton: false,
        canReadTheme: false,
        canReadLanguage: false,
      },
      theme: 'system',
      setBackButtonVisible: () => false,
      triggerHaptic: () => false,
    };
  }

  const theme =
    typeof webApp.themeParams?.bg_color === 'string' ? 'dark' : 'system';
  const language =
    typeof webApp.initDataUnsafe?.user?.language_code === 'string'
      ? webApp.initDataUnsafe.user.language_code
      : undefined;

  return {
    kind: 'telegram',
    identityAuthority: 'server-session',
    capabilities: {
      canUseHaptics: hasFunction(webApp.HapticFeedback, 'impactOccurred'),
      canUseBackButton:
        hasFunction(webApp.BackButton, 'show') &&
        hasFunction(webApp.BackButton, 'hide'),
      canReadTheme: Boolean(webApp.themeParams),
      canReadLanguage: Boolean(language),
    },
    theme,
    language,
    setBackButtonVisible: (visible) => {
      const action = visible
        ? webApp.BackButton?.show
        : webApp.BackButton?.hide;
      if (typeof action !== 'function') return false;
      action.call(webApp.BackButton);
      return true;
    },
    triggerHaptic: (kind) => {
      if (typeof webApp.HapticFeedback?.impactOccurred !== 'function')
        return false;
      webApp.HapticFeedback.impactOccurred(kind);
      return true;
    },
  };
}
