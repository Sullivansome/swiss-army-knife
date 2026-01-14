export const locales = ["en", "zh"] as const;
export const defaultLocale = "en";

export type AppLocale = (typeof locales)[number];

export function assertLocale(input: string): AppLocale {
  return (locales as readonly string[]).includes(input)
    ? (input as AppLocale)
    : defaultLocale;
}
