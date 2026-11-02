export const SUPPORTED_LANGUAGES = ['en', 'fr', 'ar'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export function isSupportedLanguage(
  value: unknown,
): value is SupportedLanguage {
  return (
    typeof value === 'string' &&
    SUPPORTED_LANGUAGES.includes(value as SupportedLanguage)
  );
}

export function directionForLanguage(
  language: SupportedLanguage,
): 'ltr' | 'rtl' {
  return language === 'ar' ? 'rtl' : 'ltr';
}

export function languageFromLocale(
  locale: string | undefined,
): SupportedLanguage {
  const language = locale?.toLowerCase().split('-')[0];
  return isSupportedLanguage(language) ? language : 'en';
}
