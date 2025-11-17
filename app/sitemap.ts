import { clientEnv } from "@/lib/env";
import { locales } from "@/lib/i18n-config";
import { tools } from "@/lib/tools";

export default function sitemap() {
  const base = clientEnv.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");

  const entries = [
    ...locales.map((locale: string) => ({
      url: `${base}/${locale}`,
      changefreq: "weekly" as const,
      priority: 0.8,
    })),
    ...locales.map((locale: string) => ({
      url: `${base}/${locale}/tools`,
      changefreq: "weekly" as const,
      priority: 0.7,
    })),
  ];

  const toolEntries = tools.flatMap((tool) =>
    locales.map((locale: string) => ({
      url: `${base}/${locale}/tools/${tool.slug}`,
      changefreq: "weekly" as const,
      priority: 0.7,
    })),
  );

  return [...entries, ...toolEntries];
}
