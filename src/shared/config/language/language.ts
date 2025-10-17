import humanizeDuration from "humanize-duration";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import { setCookie } from "@/shared/lib/cookies";

import de from "./locales/de.json";
import en from "./locales/en.json";
import es from "./locales/es.json";

export const LANGUAGE_COOKIE_NAME = "language";
export const DEFAULT_LANGUAGE = "en" as const;
export const SUPPORTED_LANGUAGES = ["en", "es", "de"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export interface LanguageOption {
  code: SupportedLanguage;
  flag: string;
  label: string;
}

// eslint-disable-next-line import-x/no-named-as-default-member
i18next.use(initReactI18next).init({
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
  lng: DEFAULT_LANGUAGE,
  resources: { de: { translation: de }, en: { translation: en }, es: { translation: es } },
});

i18next.services?.formatter?.addCached("humanize-duration", (i18nLang, options) => {
  const formatter = humanizeDuration.humanizer({ language: i18nLang, ...options });
  return (value) => formatter(value);
});

i18next.on("languageChanged", (lng) => {
  if (globalThis.window !== undefined) {
    globalThis.document.documentElement.lang = lng;
    setCookie(LANGUAGE_COOKIE_NAME, lng);
  }
});

// eslint-disable-next-line unicorn/prefer-export-from
export default i18next;
