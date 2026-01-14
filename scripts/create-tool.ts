// scripts/create-tool.ts
import * as fs from "fs";
import * as path from "path";

const TOOLS_DIR = path.join(process.cwd(), "components/tools");

function createTool(slug: string): void {
  if (!slug) {
    console.error("Usage: bun scripts/create-tool.ts <tool-slug>");
    process.exit(1);
  }

  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(slug)) {
    console.error("Error: Slug must be lowercase alphanumeric with hyphens only");
    process.exit(1);
  }

  const toolDir = path.join(TOOLS_DIR, slug);
  const i18nDir = path.join(toolDir, "i18n");

  if (fs.existsSync(toolDir)) {
    console.error(`Error: Tool directory already exists: ${toolDir}`);
    process.exit(1);
  }

  // Create directories
  fs.mkdirSync(i18nDir, { recursive: true });

  // Create meta.ts
  const metaContent = `import type { ToolMeta } from "@/lib/tool-types";

export const meta: ToolMeta = {
  slug: "${slug}",
  category: "dev", // TODO: Update category
  tags: [], // TODO: Add tags
  icon: "Wrench", // TODO: Update icon (Lucide icon name)
  seo: {
    keywords: [], // TODO: Add SEO keywords
  },
};
`;
  fs.writeFileSync(path.join(toolDir, "meta.ts"), metaContent);

  // Create index.tsx
  const componentContent = `"use client";

import type { ToolLabels } from "@/lib/tool-types";

type Props = {
  labels: ToolLabels;
};

export default function ${toPascalCase(slug)}Tool({ labels }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        {labels.description}
      </p>
      {/* TODO: Implement tool UI */}
    </div>
  );
}
`;
  fs.writeFileSync(path.join(toolDir, "index.tsx"), componentContent);

  // Create i18n/en.json
  const enContent = {
    name: toTitleCase(slug),
    description: "TODO: Add description",
  };
  fs.writeFileSync(
    path.join(i18nDir, "en.json"),
    JSON.stringify(enContent, null, 2)
  );

  // Create i18n/zh.json
  const zhContent = {
    name: "TODO: 添加名称",
    description: "TODO: 添加描述",
  };
  fs.writeFileSync(
    path.join(i18nDir, "zh.json"),
    JSON.stringify(zhContent, null, 2)
  );

  console.log(`Created tool scaffold at: ${toolDir}`);
  console.log("Next steps:");
  console.log("  1. Update meta.ts with correct category, tags, and icon");
  console.log("  2. Update i18n/en.json and i18n/zh.json with translations");
  console.log("  3. Implement the tool UI in index.tsx");
  console.log("  4. Run: bun run generate");
}

function toPascalCase(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function toTitleCase(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const slug = process.argv[2];
createTool(slug);
