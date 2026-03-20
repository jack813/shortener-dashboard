import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Provide a default locale when locale is undefined (e.g., for 404 pages)
  const validLocale = (locale as Locale) || "en";

  return {
    messages: (await import(`./locales/${validLocale}.json`)).default,
    locale: validLocale,
  };
});
