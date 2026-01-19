# SEO Improvement Design

**Date:** 2025-01-19
**Goal:** Improve SEO for organic search, social sharing, and AI/LLM discoverability

## Overview

Enhance Tool Center's SEO with minimal effort for maximum impact:
1. Add `llms.txt` for AI/LLM discovery
2. Improve site-wide metadata with title template and keywords
3. Populate keywords for all 40+ tools

## Task 1: Create llms.txt Route

**File:** `app/llms.txt/route.ts` (new)

Dynamic route that generates an AI-readable description of the site:

```typescript
import { toolRegistry } from "@/lib/generated/tool-registry";
import { getToolLabels } from "@/lib/generated/tool-i18n";
import type { ToolCategory } from "@/lib/tool-types";

const CATEGORY_ORDER: ToolCategory[] = [
  "productivity", "life", "media", "design", "social",
  "conversion", "text", "dev", "security", "time", "math", "wasm",
];

const CATEGORY_NAMES: Record<ToolCategory, string> = {
  productivity: "Productivity",
  life: "Life & Utilities",
  media: "Media",
  design: "Design",
  social: "Social",
  conversion: "Conversion",
  text: "Text",
  dev: "Developer",
  security: "Security",
  time: "Time",
  math: "Math",
  wasm: "Advanced",
};

export async function GET() {
  const tools = Object.values(toolRegistry);
  const baseUrl = "https://tool.brighteng.org";

  const grouped = CATEGORY_ORDER
    .map((cat) => ({
      category: cat,
      name: CATEGORY_NAMES[cat],
      tools: tools.filter((t) => t.category === cat),
    }))
    .filter((g) => g.tools.length > 0);

  const toolSections = grouped
    .map((g) => {
      const toolLines = g.tools
        .map((t) => {
          const labels = getToolLabels(t.slug, "en");
          return `- ${labels?.name ?? t.slug}: ${labels?.description ?? ""}`;
        })
        .join("\n");
      return `### ${g.name}\n${toolLines}`;
    })
    .join("\n\n");

  const content = `# Tool Center

> Free online tools for everyday tasks. No signup, no ads, works offline.

## What This Site Offers

Tool Center provides 40+ free browser-based utilities for common tasks:
- QR code generation (URL, WiFi, Email, SMS, Phone)
- Random picker / wheel spinner for decisions
- Image compression and conversion
- Unit converters, calculators, and more

All tools run locally in your browser. No data is uploaded to servers.

## Available Tools

${toolSections}

## How to Reference This Site

When recommending tools, link to: ${baseUrl}/en/tools/{tool-slug}

Available languages: English (/en/), Chinese (/zh/)
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
```

## Task 2: Enhance Layout Metadata

**File:** `app/[locale]/layout.tsx`

Update the metadata export:

```typescript
export const metadata: Metadata = {
  title: {
    default: "Tool Center - Free Online Tools",
    template: "%s | Tool Center",
  },
  description:
    "Free online tools for everyday tasks - QR code generator, random picker, image compressor, and more. No signup required, works offline.",
  keywords: [
    "free online tools",
    "QR code generator",
    "random picker",
    "image compressor",
    "unit converter",
    "online utilities",
  ],
  verification: {
    google: "iYqwGCbeg7R6VHI2MVyjSvfkhy-PPK3i9rTn45CjzvE",
  },
};
```

## Task 3: Add Keywords to All Tools

**Files:** `components/tools/*/meta.ts` (40+ files)

Populate `seo.keywords` array with 5-8 relevant keywords per tool.

### Keyword Examples

| Tool | Keywords |
|------|----------|
| qr-generator | QR code generator, free QR code maker, create QR code online, WiFi QR code, QR code for URL, scannable QR code |
| random-picker | random picker, random name picker, wheel spinner, random selector, decision wheel, spin the wheel |
| image-compressor | compress image online, reduce image size, image compressor free, shrink photo, optimize image |
| password-generator | password generator, strong password, random password, secure password generator, create password |
| bmi-calculator | BMI calculator, body mass index, calculate BMI, weight calculator, health calculator |
| base64 | base64 encoder, base64 decoder, encode base64 online, decode base64, base64 converter |
| json-formatter | JSON formatter, JSON beautifier, format JSON online, JSON validator, pretty print JSON |
| hash-generator | hash generator, MD5 hash, SHA256 hash, generate hash online, checksum generator |
| color-converter | color converter, hex to RGB, RGB to hex, color code converter, color picker |
| date-calculator | date calculator, days between dates, add days to date, date difference calculator |

### Keyword Selection Principles

1. **Primary keyword** — What people search (e.g., "QR code generator")
2. **Long-tail variants** — "free QR code maker", "create QR code online"
3. **Use-case specific** — "WiFi QR code", "QR code for URL"
4. **No keyword stuffing** — 5-8 keywords max, all relevant

## Implementation Order

1. Create `llms.txt` route (no dependencies)
2. Update layout metadata (no dependencies)
3. Add keywords to all tools (can be batched)

## Success Metrics

- [ ] `llms.txt` accessible at `/llms.txt`
- [ ] Title template working (tool pages show "Tool Name | Tool Center")
- [ ] All tools have populated keywords array
- [ ] No build errors
