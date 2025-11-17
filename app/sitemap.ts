import { tools } from "@/lib/tools";
import { clientEnv } from "@/lib/env";
import { routing } from "@/i18n/routing";

export default function sitemap() {
  const base = clientEnv.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");

  const entries = [
    ...routing.locales.map((locale) => ({
      url: `${base}/${locale}`,
      changefreq: "weekly" as const,
      priority: 0.8,
    })),
    ...routing.locales.map((locale) => ({
      url: `${base}/${locale}/tools`,
      changefreq: "weekly" as const,
      priority: 0.7,
    })),
  ];

  const toolEntries = tools.flatMap((tool) =>
    routing.locales.map((locale) => ({
      url: `${base}/${locale}/tools/${tool.slug}`,
      changefreq: "weekly" as const,
      priority: 0.7,
    })),
  );

  return [...entries, ...toolEntries];
}
