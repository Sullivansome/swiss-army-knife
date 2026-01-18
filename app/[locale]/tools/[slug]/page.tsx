// app/[locale]/tools/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolJsonLd } from "@/components/tool-json-ld";
import { ToolShell } from "@/components/tool-shell";
import { getDictionary } from "@/lib/dictionaries";
import { clientEnv } from "@/lib/env";
import { getToolLabels } from "@/lib/generated/tool-i18n";
import {
  toolLoaders,
  toolRegistry,
  toolSlugs,
} from "@/lib/generated/tool-registry";
import { assertLocale, locales } from "@/lib/i18n-config";
import type { ToolLabels } from "@/lib/tool-types";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return toolSlugs.flatMap((slug) =>
    locales.map((locale) => ({ slug, locale })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale: raw } = await params;
  const locale = assertLocale(raw);
  const tool = toolRegistry[slug];
  const labels = getToolLabels(slug, locale) as ToolLabels | null;

  if (!tool || !labels) {
    return {};
  }

  const baseUrl = clientEnv.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");

  return {
    title: labels.name,
    description: labels.description,
    keywords: tool.seo?.keywords ?? [],
    alternates: {
      canonical: `${baseUrl}/${locale}/tools/${slug}`,
      languages: {
        en: `${baseUrl}/en/tools/${slug}`,
        zh: `${baseUrl}/zh/tools/${slug}`,
      },
    },
    openGraph: {
      title: labels.name,
      description: labels.description,
      url: `${baseUrl}/${locale}/tools/${slug}`,
      images: [`${baseUrl}/api/og/${slug}?locale=${locale}`],
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: labels.name,
      description: labels.description,
      images: [`${baseUrl}/api/og/${slug}?locale=${locale}`],
    },
  };
}

// Helper to get tool-specific labels from the old dictionary
function getToolSpecificLabels(
  dict: Record<string, unknown>,
  slug: string,
): Record<string, unknown> {
  // Manual mappings for tools with non-standard dictionary keys
  const manualMappings: Record<string, string> = {
    "finance-essentials": "financeToolkit",
    "timezone-meeting-planner": "timezonePlanner",
    "color-contrast-checker": "colorContrast",
    "markdown-preview": "markdown",
  };

  // Check manual mapping first
  if (manualMappings[slug] && dict[manualMappings[slug]]) {
    return dict[manualMappings[slug]] as Record<string, unknown>;
  }

  // Convert slug to camelCase key (e.g., "social-mockup" -> "socialMockup")
  const camelKey = slug.replace(/-./g, (x) => x[1].toUpperCase());

  // Also try common variations - some tools use abbreviated keys
  // e.g., "family-relation-calculator" -> "familyRelation"
  const shortKey = camelKey.replace(
    /Calculator$|Tool$|Generator$|Converter$|Checker$|Viewer$|Inspector$|Explainer$|Compressor$|Preview$|Picker$|Formatter$|Cleaner$|Summary$|Planner$|Essentials$/i,
    "",
  );

  // For "international-temperature-converter" -> try "temperatureConverter"
  const parts = slug.split("-");
  const lastTwoParts = parts
    .slice(-2)
    .join("-")
    .replace(/-./g, (x) => x[1].toUpperCase());

  // Try various keys in the dictionary
  const candidates = [
    dict[camelKey],
    dict[shortKey],
    dict[lastTwoParts],
    dict[slug],
    dict[slug.replace(/-/g, "")],
  ];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object") {
      return candidate as Record<string, unknown>;
    }
  }

  return {};
}

export default async function ToolPage({ params }: Props) {
  const { slug, locale: raw } = await params;
  const locale = assertLocale(raw);
  const tool = toolRegistry[slug];

  if (!tool) {
    notFound();
  }

  const loader = toolLoaders[slug as keyof typeof toolLoaders];
  if (!loader) {
    notFound();
  }

  const [moduleResult, newLabels, dict] = await Promise.all([
    loader(),
    Promise.resolve(getToolLabels(slug, locale) as ToolLabels | null),
    getDictionary(locale),
  ]);

  if (!moduleResult || !newLabels) {
    notFound();
  }

  // Merge new labels with old dictionary labels for backward compatibility
  const toolSpecificLabels = getToolSpecificLabels(
    dict as Record<string, unknown>,
    slug,
  );
  const labels = {
    ...newLabels,
    ...toolSpecificLabels,
  } as ToolLabels;

  // Access the default export from the dynamic import
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ToolComponent = (moduleResult as any).default;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <ToolJsonLd tool={tool} labels={labels} locale={locale} />
      <ToolShell title={labels.name} description={labels.description}>
        <ToolComponent labels={labels} />
      </ToolShell>
    </div>
  );
}
