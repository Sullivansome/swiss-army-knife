// components/tool-json-ld.tsx
import { clientEnv } from "@/lib/env";
import type { ToolLabels, ToolMeta } from "@/lib/tool-types";

type Props = {
  tool: ToolMeta;
  labels: ToolLabels;
  locale: string;
};

export function ToolJsonLd({ tool, labels, locale }: Props) {
  const baseUrl = clientEnv.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: labels.name,
    description: labels.description,
    url: `${baseUrl}/${locale}/tools/${tool.slug}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    inLanguage: locale === "zh" ? "zh-CN" : "en-US",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${baseUrl}/${locale}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Tools",
          item: `${baseUrl}/${locale}/tools`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: labels.name,
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
