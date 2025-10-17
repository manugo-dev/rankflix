import { useTranslation, type UseTranslationOptions } from "react-i18next";

export function useTranslate(namespace?: string, options?: UseTranslationOptions<string>) {
  const { i18n, t } = useTranslation(namespace, options);
  return { i18n, t };
}
