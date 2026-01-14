import en from "../messages/en.json";
import zh from "../messages/zh.json";
import { type AppLocale, assertLocale } from "./i18n-config";

const dictionaries = {
  en,
  zh,
} as const;

export type Dictionary = typeof dictionaries.en;

export async function getDictionary(
  locale: string | undefined,
): Promise<Dictionary> {
  const safeLocale: AppLocale = assertLocale(locale ?? "");
  return dictionaries[safeLocale];
}
