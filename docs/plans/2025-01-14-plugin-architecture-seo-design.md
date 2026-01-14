# Plugin-Based Tool Architecture & Comprehensive SEO

**Date:** 2025-01-14
**Status:** Draft
**Scope:** Modularity improvements + SEO enhancements

---

## Goals

1. **Modularity** — Make adding new tools trivial (single folder, no manual wiring)
2. **SEO** — Comprehensive coverage: OG images, JSON-LD, canonical URLs, hreflang, keywords

---

## Current Pain Points

### Modularity
- Adding a tool requires changes in 4 places:
  1. `lib/tools.ts` (tool definition)
  2. `components/tools/` (component file)
  3. `messages/en.json` + `messages/zh.json` (translations)
  4. `app/[locale]/tools/[slug]/page.tsx` (import + switch case — 480+ lines)
- The page.tsx switch statement grows linearly and is error-prone
- Translations are disconnected from tool code

### SEO
- Missing Open Graph images for social sharing
- No JSON-LD structured data (Schema.org)
- No per-tool keywords
- No explicit canonical URLs or hreflang tags
- Basic sitemap without lastmod

---

## Design

### 1. Plugin-Based Tool Structure

Each tool becomes a self-contained module:

```
components/tools/
├── base64/
│   ├── index.tsx          # Main component (default export)
│   ├── meta.ts             # Tool metadata
│   └── i18n/
│       ├── en.json         # Tool-specific English translations
│       └── zh.json         # Tool-specific Chinese translations
├── json-formatter/
│   ├── index.tsx
│   ├── meta.ts
│   └── i18n/
│       ├── en.json
│       └── zh.json
...
```

#### meta.ts

```ts
import type { ToolMeta } from "@/lib/tool-types";

export const meta: ToolMeta = {
  slug: "base64",
  category: "text",
  tags: ["encode", "decode"],
  icon: "FileText",
  seo: {
    keywords: ["base64 encoder", "base64 decoder", "text encoding"],
  },
};
```

#### Tool-specific i18n/en.json

```json
{
  "name": "Base64 Converter",
  "description": "Encode and decode text locally in your browser.",
  "encode": "Encode",
  "decode": "Decode",
  "placeholder": "Paste text here..."
}
```

#### Shared translations remain in messages/

```json
{
  "layout": { "brand": "Tool Center", "navTools": "Tools", ... },
  "categories": { "dev": "Developer", "text": "Text", ... },
  "common": { "copy": "Copy", "clear": "Clear", "error": "Something went wrong." }
}
```

---

### 2. Auto-Generated Registry

A build script scans `components/tools/*/meta.ts` and generates:

#### lib/generated/tool-registry.ts

```ts
// Auto-generated — do not edit manually
import type { ToolMeta } from "@/lib/tool-types";

export const toolRegistry: Record<string, ToolMeta> = {
  "base64": {
    slug: "base64",
    category: "text",
    tags: ["encode", "decode"],
    icon: "FileText",
    seo: { keywords: ["base64 encoder", "base64 decoder"] },
  },
  "json-formatter": { ... },
  // ... all tools
};

export const toolLoaders: Record<string, () => Promise<{ default: React.ComponentType<{ labels: unknown }> }>> = {
  "base64": () => import("@/components/tools/base64"),
  "json-formatter": () => import("@/components/tools/json-formatter"),
  // ... all tools
};

export const toolSlugs = Object.keys(toolRegistry);
```

#### lib/generated/tool-i18n.ts

```ts
// Auto-generated — do not edit manually

const toolTranslations: Record<string, Record<string, unknown>> = {
  en: {
    "base64": { name: "Base64 Converter", description: "...", encode: "Encode", ... },
    "json-formatter": { name: "JSON Formatter & Validator", ... },
  },
  zh: {
    "base64": { name: "Base64 编解码", description: "...", ... },
    "json-formatter": { name: "JSON 格式化工具", ... },
  },
};

export function getToolLabels(slug: string, locale: string) {
  return toolTranslations[locale]?.[slug] ?? toolTranslations["en"]?.[slug] ?? null;
}
```

---

### 3. Simplified Tool Page

The 480-line switch statement becomes:

```tsx
// app/[locale]/tools/[slug]/page.tsx
import { getTool, loadTool } from "@/lib/tool-loader";
import { getToolLabels } from "@/lib/generated/tool-i18n";
import { ToolShell } from "@/components/tool-shell";
import { ToolJsonLd } from "@/components/tool-json-ld";

export async function generateStaticParams() {
  const { toolSlugs } = await import("@/lib/generated/tool-registry");
  return toolSlugs.flatMap(slug => locales.map(locale => ({ slug, locale })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const tool = getTool(slug);
  const labels = await getToolLabels(slug, locale);
  const baseUrl = clientEnv.NEXT_PUBLIC_BASE_URL;

  return {
    title: labels.name,
    description: labels.description,
    keywords: tool?.seo?.keywords ?? [],
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

export default async function ToolPage({ params }: Props) {
  const { slug, locale } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const [module, labels] = await Promise.all([
    loadTool(slug),
    getToolLabels(slug, locale),
  ]);

  if (!module) notFound();
  const ToolComponent = module.default;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <ToolJsonLd tool={tool} labels={labels} locale={locale} />
      <ToolShell title={labels.name} description={labels.description}>
        <ToolComponent labels={labels} />
      </ToolShell>
    </div>
  );
}
```

---

### 4. SEO Components

#### JSON-LD Structured Data

```tsx
// components/tool-json-ld.tsx
export function ToolJsonLd({ tool, labels, locale }: Props) {
  const baseUrl = clientEnv.NEXT_PUBLIC_BASE_URL;

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
    inLanguage: locale,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/${locale}` },
        { "@type": "ListItem", position: 2, name: "Tools", item: `${baseUrl}/${locale}/tools` },
        { "@type": "ListItem", position: 3, name: labels.name },
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
```

#### OG Image API Route (On-Demand)

```tsx
// app/api/og/[slug]/route.tsx
import { ImageResponse } from "next/og";
import { getTool } from "@/lib/tool-loader";
import { getToolLabels } from "@/lib/generated/tool-i18n";

export const runtime = "edge";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const locale = new URL(req.url).searchParams.get("locale") ?? "en";
  const labels = await getToolLabels(slug, locale);
  const tool = getTool(slug);

  if (!tool || !labels) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#0a0a0a",
          color: "#fafafa",
          padding: 60,
        }}
      >
        <h1 style={{ fontSize: 64, marginBottom: 20 }}>{labels.name}</h1>
        <p style={{ fontSize: 32, opacity: 0.8, textAlign: "center" }}>
          {labels.description}
        </p>
        <span style={{ fontSize: 24, marginTop: 40, opacity: 0.6 }}>
          Tool Center
        </span>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

#### Build-Time OG Pre-Generation

Script fetches `/api/og/[slug]?locale=X` for each tool and saves to `public/og/`.
Metadata checks for static file first, falls back to API route.

---

### 5. Enhanced Sitemap

```ts
// app/sitemap.ts
import { toolRegistry } from "@/lib/generated/tool-registry";
import { locales } from "@/lib/i18n-config";
import { clientEnv } from "@/lib/env";

export default function sitemap() {
  const base = clientEnv.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");
  const tools = Object.values(toolRegistry);
  const now = new Date().toISOString();

  return [
    // Home pages
    ...locales.map(locale => ({
      url: `${base}/${locale}`,
      lastmod: now,
      changefreq: "weekly" as const,
      priority: 1.0,
    })),
    // Tool listing pages
    ...locales.map(locale => ({
      url: `${base}/${locale}/tools`,
      lastmod: now,
      changefreq: "weekly" as const,
      priority: 0.9,
    })),
    // Individual tool pages
    ...tools.flatMap(tool =>
      locales.map(locale => ({
        url: `${base}/${locale}/tools/${tool.slug}`,
        lastmod: now,
        changefreq: "monthly" as const,
        priority: 0.8,
      }))
    ),
  ];
}
```

---

### 6. Developer Workflow

#### Adding a New Tool

```bash
npm run tool:create my-new-tool
```

Creates scaffold:
```
components/tools/my-new-tool/
├── index.tsx
├── meta.ts
└── i18n/
    ├── en.json
    └── zh.json
```

Then:
```bash
npm run generate   # Rebuild registry
npm run dev        # Tool available immediately
```

#### Package.json Scripts

```json
{
  "scripts": {
    "generate": "tsx scripts/generate-registry.ts",
    "generate:og": "tsx scripts/generate-og-images.ts",
    "prebuild": "npm run generate",
    "build": "next build && npm run generate:og",
    "dev": "npm run generate && next dev",
    "tool:create": "tsx scripts/create-tool.ts",
    "tool:validate": "tsx scripts/validate-tools.ts",
    "tool:migrate": "tsx scripts/migrate-tools.ts"
  }
}
```

#### Validation

`npm run tool:validate` checks:
- Every tool has `index.tsx`, `meta.ts`, `i18n/en.json`, `i18n/zh.json`
- Every translation has `name` and `description`
- Category is from allowed list
- Warns on missing optional fields (keywords, icon)
- Errors block build if critical files missing

---

### 7. Migration Plan

#### Phase 1: Infrastructure (Day 1)
1. Create `lib/tool-types.ts` with `ToolMeta` type
2. Create `scripts/generate-registry.ts`
3. Create `scripts/generate-og-images.ts`
4. Create `scripts/create-tool.ts`
5. Create `scripts/validate-tools.ts`
6. Create `scripts/migrate-tools.ts`
7. Create `lib/tool-loader.ts`
8. Create `components/tool-json-ld.tsx`
9. Create `app/api/og/[slug]/route.tsx`

#### Phase 2: Migration (Day 1-2)
1. Run `npm run tool:migrate` to convert existing 44 tools
2. Manual review: add keywords to each `meta.ts`
3. Verify translations extracted correctly

#### Phase 3: Integration (Day 2)
1. Update `app/[locale]/tools/[slug]/page.tsx` to use new loader
2. Update `app/sitemap.ts` to use generated registry
3. Delete old `lib/tools.ts` and tool entries from `messages/*.json`
4. Update `package.json` scripts

#### Phase 4: Validation (Day 2-3)
1. Run `npm run tool:validate`
2. Test all 44 tools in both locales
3. Verify OG images generate correctly
4. Test structured data with Google Rich Results Test
5. Verify sitemap.xml output

---

## Files to Create

| File | Purpose |
|------|---------|
| `lib/tool-types.ts` | TypeScript types for ToolMeta |
| `lib/tool-loader.ts` | Helper functions for loading tools |
| `lib/generated/.gitkeep` | Placeholder for generated files |
| `scripts/generate-registry.ts` | Build script for registry + i18n |
| `scripts/generate-og-images.ts` | Pre-generate OG images |
| `scripts/create-tool.ts` | Scaffold new tool |
| `scripts/validate-tools.ts` | Validate tool completeness |
| `scripts/migrate-tools.ts` | Migrate existing tools |
| `components/tool-json-ld.tsx` | JSON-LD structured data |
| `app/api/og/[slug]/route.tsx` | OG image generation |

## Files to Modify

| File | Changes |
|------|---------|
| `app/[locale]/tools/[slug]/page.tsx` | Replace switch with dynamic loader |
| `app/sitemap.ts` | Use generated registry |
| `package.json` | Add new scripts |
| `messages/en.json` | Remove tool-specific translations |
| `messages/zh.json` | Remove tool-specific translations |

## Files to Delete (After Migration)

| File | Reason |
|------|--------|
| `lib/tools.ts` | Replaced by generated registry |

---

## Success Criteria

- [ ] Adding a new tool requires only creating one folder with 4 files
- [ ] No manual imports or switch statements needed
- [ ] All tools have OG images for social sharing
- [ ] All tool pages have JSON-LD structured data
- [ ] Sitemap includes all tools with proper metadata
- [ ] Build fails if tool is incomplete (missing translations, etc.)
- [ ] Existing 44 tools work identically after migration
