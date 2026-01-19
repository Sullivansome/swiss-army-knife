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
