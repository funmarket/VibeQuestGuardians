import {
  directionForLanguage,
  languageFromLocale,
  type SupportedLanguage,
} from './localization.js';
import type { HostAdapter, HostTheme } from './host.js';

export type TextScale = 'system' | 'large';

export interface PlatformPreferences {
  language: SupportedLanguage;
  direction: 'ltr' | 'rtl';
  theme: HostTheme;
  textScale: TextScale;
}

export interface PlatformPreferenceInput {
  host: Pick<HostAdapter, 'kind' | 'theme' | 'language'>;
  browserLocale?: string;
  systemTheme?: Exclude<HostTheme, 'system'>;
  userOverrides?: Partial<PlatformPreferences>;
}

export function resolvePlatformPreferences(
  input: PlatformPreferenceInput,
): PlatformPreferences {
  const language =
    input.userOverrides?.language ??
    (input.host.kind === 'telegram' && input.host.language
      ? languageFromLocale(input.host.language)
      : languageFromLocale(input.browserLocale));
  const theme =
    input.userOverrides?.theme ??
    input.host.theme ??
    input.systemTheme ??
    'system';
  const textScale = input.userOverrides?.textScale ?? 'system';
  return {
    language,
    direction: directionForLanguage(language),
    theme,
    textScale,
  };
}
