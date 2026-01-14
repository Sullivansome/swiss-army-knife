// app/sitemap.ts
import { clientEnv } from "@/lib/env";
import { locales } from "@/lib/i18n-config";
import { toolRegistry } from "@/lib/generated/tool-registry";

export default function sitemap() {
  const base = clientEnv.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");
  const tools = Object.values(toolRegistry);
  const now = new Date().toISOString();

  return [
    // Home pages
    ...locales.map((locale: string) => ({
      url: `${base}/${locale}`,
      lastmod: now,
      changefreq: "weekly" as const,
      priority: 1.0,
    })),
    // Tool listing pages
    ...locales.map((locale: string) => ({
      url: `${base}/${locale}/tools`,
      lastmod: now,
      changefreq: "weekly" as const,
      priority: 0.9,
    })),
    // Individual tool pages
    ...tools.flatMap((tool) =>
      locales.map((locale: string) => ({
        url: `${base}/${locale}/tools/${tool.slug}`,
        lastmod: now,
        changefreq: "monthly" as const,
        priority: 0.8,
      }))
    ),
  ];
}
