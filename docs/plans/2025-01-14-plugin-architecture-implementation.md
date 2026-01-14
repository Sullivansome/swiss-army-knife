# Plugin-Based Tool Architecture Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor tool registration from a manual 4-step process to a self-contained plugin system with auto-discovery, plus comprehensive SEO.

**Architecture:** Each tool becomes a self-contained folder with component, metadata, and translations. A build script scans these folders and generates a registry + merged translations. The page.tsx switch statement is replaced with dynamic imports.

**Tech Stack:** Next.js 16, TypeScript, Bun (runtime + package manager), @vercel/og (for OG images)

---

## Phase 1: Infrastructure

### Task 1: Create Tool Types

**Files:**
- Create: `lib/tool-types.ts`

**Step 1: Write the type definitions**

```typescript
// lib/tool-types.ts
import type { ComponentType } from "react";

export type ToolCategory =
  | "dev"
  | "text"
  | "security"
  | "media"
  | "time"
  | "math"
  | "productivity"
  | "design"
  | "social"
  | "life"
  | "wasm"
  | "数据换算";

export type ToolSeoConfig = {
  keywords?: string[];
};

export type ToolMeta = {
  slug: string;
  category: ToolCategory;
  tags?: string[];
  icon?: string;
  seo?: ToolSeoConfig;
};

export type ToolLabels = {
  name: string;
  description: string;
  [key: string]: unknown;
};

export type ToolComponent = ComponentType<{ labels: ToolLabels }>;

export type ToolModule = {
  default: ToolComponent;
};

export type ToolLoader = () => Promise<ToolModule>;
```

**Step 2: Verify TypeScript compiles**

Run: `bun run tsc --noEmit lib/tool-types.ts`
Expected: No errors

**Step 3: Commit**

```bash
git add lib/tool-types.ts
git commit -m "feat: add tool type definitions for plugin architecture"
```

---

### Task 2: Create Generated Directory Structure

**Files:**
- Create: `lib/generated/.gitkeep`
- Modify: `.gitignore`

**Step 1: Create the generated directory**

```bash
mkdir -p lib/generated
touch lib/generated/.gitkeep
```

**Step 2: Add generated files to gitignore (except .gitkeep)**

Add to `.gitignore`:
```
# generated files (rebuilt on each build)
lib/generated/*
!lib/generated/.gitkeep
```

**Step 3: Commit**

```bash
git add lib/generated/.gitkeep .gitignore
git commit -m "feat: add lib/generated directory for auto-generated registry"
```

---

### Task 3: Create Tool Loader Helper

**Files:**
- Create: `lib/tool-loader.ts`

**Step 1: Write the loader module**

```typescript
// lib/tool-loader.ts
import type { ToolMeta, ToolModule } from "./tool-types";

// These will be populated by generated code
let toolRegistry: Record<string, ToolMeta> = {};
let toolLoaders: Record<string, () => Promise<ToolModule>> = {};

export function setRegistry(
  registry: Record<string, ToolMeta>,
  loaders: Record<string, () => Promise<ToolModule>>
) {
  toolRegistry = registry;
  toolLoaders = loaders;
}

export function getTool(slug: string): ToolMeta | null {
  return toolRegistry[slug] ?? null;
}

export function getAllTools(): ToolMeta[] {
  return Object.values(toolRegistry);
}

export function getToolsByCategory(category: string): ToolMeta[] {
  return Object.values(toolRegistry).filter((t) => t.category === category);
}

export function getToolSlugs(): string[] {
  return Object.keys(toolRegistry);
}

export async function loadTool(slug: string): Promise<ToolModule | null> {
  const loader = toolLoaders[slug];
  if (!loader) return null;
  return loader();
}
```

**Step 2: Verify TypeScript compiles**

Run: `bun run tsc --noEmit lib/tool-loader.ts`
Expected: No errors

**Step 3: Commit**

```bash
git add lib/tool-loader.ts
git commit -m "feat: add tool loader helper for dynamic tool imports"
```

---

### Task 4: Create Registry Generation Script

**Files:**
- Create: `scripts/generate-registry.ts`

**Step 1: Write the generation script**

```typescript
// scripts/generate-registry.ts
import * as fs from "fs";
import * as path from "path";

const TOOLS_DIR = path.join(process.cwd(), "components/tools");
const GENERATED_DIR = path.join(process.cwd(), "lib/generated");
const LOCALES = ["en", "zh"];

type ToolMeta = {
  slug: string;
  category: string;
  tags?: string[];
  icon?: string;
  seo?: { keywords?: string[] };
};

type ToolTranslations = Record<string, Record<string, unknown>>;

function getToolFolders(): string[] {
  if (!fs.existsSync(TOOLS_DIR)) return [];
  return fs
    .readdirSync(TOOLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function loadToolMeta(folder: string): ToolMeta | null {
  const metaPath = path.join(TOOLS_DIR, folder, "meta.ts");
  if (!fs.existsSync(metaPath)) return null;

  // Read and parse meta.ts (simple extraction)
  const content = fs.readFileSync(metaPath, "utf-8");

  // Extract slug
  const slugMatch = content.match(/slug:\s*["']([^"']+)["']/);
  const categoryMatch = content.match(/category:\s*["']([^"']+)["']/);

  if (!slugMatch || !categoryMatch) {
    console.warn(`Warning: Could not parse meta.ts for ${folder}`);
    return null;
  }

  const meta: ToolMeta = {
    slug: slugMatch[1],
    category: categoryMatch[1],
  };

  // Extract optional fields
  const tagsMatch = content.match(/tags:\s*\[([^\]]*)\]/);
  if (tagsMatch) {
    meta.tags = tagsMatch[1]
      .split(",")
      .map((t) => t.trim().replace(/["']/g, ""))
      .filter(Boolean);
  }

  const iconMatch = content.match(/icon:\s*["']([^"']+)["']/);
  if (iconMatch) {
    meta.icon = iconMatch[1];
  }

  const keywordsMatch = content.match(/keywords:\s*\[([^\]]*)\]/);
  if (keywordsMatch) {
    meta.seo = {
      keywords: keywordsMatch[1]
        .split(",")
        .map((k) => k.trim().replace(/["']/g, ""))
        .filter(Boolean),
    };
  }

  return meta;
}

function loadToolTranslations(folder: string): ToolTranslations {
  const translations: ToolTranslations = {};

  for (const locale of LOCALES) {
    const i18nPath = path.join(TOOLS_DIR, folder, "i18n", `${locale}.json`);
    if (fs.existsSync(i18nPath)) {
      try {
        translations[locale] = JSON.parse(fs.readFileSync(i18nPath, "utf-8"));
      } catch (e) {
        console.warn(`Warning: Could not parse ${i18nPath}`);
      }
    }
  }

  return translations;
}

function generateRegistry(): void {
  const folders = getToolFolders();
  const tools: Record<string, ToolMeta> = {};
  const allTranslations: Record<string, Record<string, unknown>> = {};

  // Initialize locale containers
  for (const locale of LOCALES) {
    allTranslations[locale] = {};
  }

  for (const folder of folders) {
    // Check if this is a new-style plugin (has meta.ts)
    const meta = loadToolMeta(folder);
    if (!meta) continue;

    tools[meta.slug] = meta;

    // Load translations
    const translations = loadToolTranslations(folder);
    for (const locale of LOCALES) {
      if (translations[locale]) {
        allTranslations[locale][meta.slug] = translations[locale];
      }
    }
  }

  // Ensure generated directory exists
  if (!fs.existsSync(GENERATED_DIR)) {
    fs.mkdirSync(GENERATED_DIR, { recursive: true });
  }

  // Generate tool-registry.ts
  const registryContent = `// Auto-generated by scripts/generate-registry.ts — do not edit manually
import type { ToolMeta, ToolModule } from "../tool-types";

export const toolRegistry: Record<string, ToolMeta> = ${JSON.stringify(tools, null, 2)};

export const toolLoaders: Record<string, () => Promise<ToolModule>> = {
${Object.keys(tools)
  .map((slug) => `  "${slug}": () => import("@/components/tools/${slug}"),`)
  .join("\n")}
};

export const toolSlugs = Object.keys(toolRegistry);
`;

  fs.writeFileSync(
    path.join(GENERATED_DIR, "tool-registry.ts"),
    registryContent
  );

  // Generate tool-i18n.ts
  const i18nContent = `// Auto-generated by scripts/generate-registry.ts — do not edit manually

const toolTranslations: Record<string, Record<string, unknown>> = ${JSON.stringify(allTranslations, null, 2)};

export function getToolLabels(slug: string, locale: string): Record<string, unknown> | null {
  return (toolTranslations[locale]?.[slug] ?? toolTranslations["en"]?.[slug] ?? null) as Record<string, unknown> | null;
}
`;

  fs.writeFileSync(path.join(GENERATED_DIR, "tool-i18n.ts"), i18nContent);

  console.log(`Generated registry with ${Object.keys(tools).length} tools`);
}

generateRegistry();
```

**Step 2: Make script executable and test with empty output**

Run: `bun scripts/generate-registry.ts`
Expected: "Generated registry with 0 tools" (no plugin-style tools yet)

**Step 3: Verify generated files exist**

Run: `ls -la lib/generated/`
Expected: tool-registry.ts and tool-i18n.ts exist

**Step 4: Commit**

```bash
git add scripts/generate-registry.ts lib/generated/tool-registry.ts lib/generated/tool-i18n.ts
git commit -m "feat: add registry generation script for plugin discovery"
```

---

### Task 5: Create Tool Scaffold Script

**Files:**
- Create: `scripts/create-tool.ts`

**Step 1: Write the scaffold script**

```typescript
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
```

**Step 2: Test the scaffold script**

Run: `bun scripts/create-tool.ts test-tool`
Expected: Creates `components/tools/test-tool/` with all files

**Step 3: Verify scaffold structure**

Run: `ls -la components/tools/test-tool/`
Expected: index.tsx, meta.ts, i18n/ directory

**Step 4: Clean up test tool**

Run: `rm -rf components/tools/test-tool`

**Step 5: Commit**

```bash
git add scripts/create-tool.ts
git commit -m "feat: add tool scaffold script for creating new tools"
```

---

### Task 6: Create Validation Script

**Files:**
- Create: `scripts/validate-tools.ts`

**Step 1: Write the validation script**

```typescript
// scripts/validate-tools.ts
import * as fs from "fs";
import * as path from "path";

const TOOLS_DIR = path.join(process.cwd(), "components/tools");
const LOCALES = ["en", "zh"];
const VALID_CATEGORIES = [
  "dev",
  "text",
  "security",
  "media",
  "time",
  "math",
  "productivity",
  "design",
  "social",
  "life",
  "wasm",
  "数据换算",
];

type ValidationResult = {
  slug: string;
  errors: string[];
  warnings: string[];
};

function validateTool(folder: string): ValidationResult | null {
  const toolDir = path.join(TOOLS_DIR, folder);
  const result: ValidationResult = {
    slug: folder,
    errors: [],
    warnings: [],
  };

  // Check for meta.ts (indicates new-style plugin)
  const metaPath = path.join(toolDir, "meta.ts");
  if (!fs.existsSync(metaPath)) {
    // Not a new-style plugin, skip
    return null;
  }

  // Check for index.tsx
  const indexPath = path.join(toolDir, "index.tsx");
  if (!fs.existsSync(indexPath)) {
    result.errors.push("Missing index.tsx");
  }

  // Check meta.ts content
  const metaContent = fs.readFileSync(metaPath, "utf-8");

  const slugMatch = metaContent.match(/slug:\s*["']([^"']+)["']/);
  if (!slugMatch) {
    result.errors.push("meta.ts missing slug");
  } else if (slugMatch[1] !== folder) {
    result.errors.push(`meta.ts slug "${slugMatch[1]}" doesn't match folder "${folder}"`);
  }

  const categoryMatch = metaContent.match(/category:\s*["']([^"']+)["']/);
  if (!categoryMatch) {
    result.errors.push("meta.ts missing category");
  } else if (!VALID_CATEGORIES.includes(categoryMatch[1])) {
    result.errors.push(`Invalid category: ${categoryMatch[1]}`);
  }

  // Check for keywords (warning only)
  if (!metaContent.includes("keywords:")) {
    result.warnings.push("meta.ts missing SEO keywords");
  }

  // Check i18n files
  for (const locale of LOCALES) {
    const i18nPath = path.join(toolDir, "i18n", `${locale}.json`);
    if (!fs.existsSync(i18nPath)) {
      result.errors.push(`Missing i18n/${locale}.json`);
    } else {
      try {
        const content = JSON.parse(fs.readFileSync(i18nPath, "utf-8"));
        if (!content.name) {
          result.errors.push(`i18n/${locale}.json missing "name"`);
        }
        if (!content.description) {
          result.errors.push(`i18n/${locale}.json missing "description"`);
        }
      } catch {
        result.errors.push(`i18n/${locale}.json is not valid JSON`);
      }
    }
  }

  return result;
}

function main(): void {
  if (!fs.existsSync(TOOLS_DIR)) {
    console.log("No tools directory found");
    return;
  }

  const folders = fs
    .readdirSync(TOOLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  let hasErrors = false;
  let pluginCount = 0;

  for (const folder of folders) {
    const result = validateTool(folder);
    if (!result) continue; // Not a plugin-style tool

    pluginCount++;

    if (result.errors.length > 0) {
      hasErrors = true;
      console.error(`\n❌ ${result.slug}:`);
      result.errors.forEach((e) => console.error(`   ERROR: ${e}`));
    }

    if (result.warnings.length > 0) {
      console.warn(`\n⚠️  ${result.slug}:`);
      result.warnings.forEach((w) => console.warn(`   WARNING: ${w}`));
    }

    if (result.errors.length === 0 && result.warnings.length === 0) {
      console.log(`✅ ${result.slug}`);
    }
  }

  console.log(`\nValidated ${pluginCount} plugin-style tools`);

  if (hasErrors) {
    console.error("\n❌ Validation failed with errors");
    process.exit(1);
  } else {
    console.log("\n✅ All tools valid");
  }
}

main();
```

**Step 2: Test validation (should pass with 0 plugins)**

Run: `bun scripts/validate-tools.ts`
Expected: "Validated 0 plugin-style tools" and "All tools valid"

**Step 3: Commit**

```bash
git add scripts/validate-tools.ts
git commit -m "feat: add tool validation script"
```

---

### Task 7: Update package.json Scripts

**Files:**
- Modify: `package.json`

**Step 1: Add new scripts**

Update the scripts section in package.json:

```json
{
  "scripts": {
    "dev": "bun run generate && bun --bun next dev",
    "build": "bun run generate && bun --bun next build",
    "start": "bun --bun next start",
    "lint": "biome check --diagnostic-level=error",
    "lint:fix": "biome check --fix",
    "format": "biome format --write",
    "check": "biome check --fix",
    "test:unit": "vitest run",
    "generate": "bun scripts/generate-registry.ts",
    "tool:create": "bun scripts/create-tool.ts",
    "tool:validate": "bun scripts/validate-tools.ts"
  }
}
```

**Step 2: Test the generate script via bun**

Run: `bun run generate`
Expected: "Generated registry with 0 tools"

**Step 3: Commit**

```bash
git add package.json
git commit -m "feat: add bun scripts for tool generation and validation"
```

---

### Task 8: Create JSON-LD Component

**Files:**
- Create: `components/tool-json-ld.tsx`

**Step 1: Write the JSON-LD component**

```tsx
// components/tool-json-ld.tsx
import { clientEnv } from "@/lib/env";
import type { ToolMeta, ToolLabels } from "@/lib/tool-types";

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
```

**Step 2: Verify TypeScript compiles**

Run: `bun run tsc --noEmit components/tool-json-ld.tsx`
Expected: No errors

**Step 3: Commit**

```bash
git add components/tool-json-ld.tsx
git commit -m "feat: add JSON-LD structured data component for tools"
```

---

### Task 9: Create OG Image API Route

**Files:**
- Create: `app/api/og/[slug]/route.tsx`

**Step 1: Write the OG image route**

```tsx
// app/api/og/[slug]/route.tsx
import { ImageResponse } from "next/og";
import { getToolLabels } from "@/lib/generated/tool-i18n";

export const runtime = "edge";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(req: Request, { params }: Props) {
  const { slug } = await params;
  const url = new URL(req.url);
  const locale = url.searchParams.get("locale") ?? "en";

  const labels = getToolLabels(slug, locale);

  if (!labels) {
    return new Response("Tool not found", { status: 404 });
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
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1
          style={{
            fontSize: 64,
            fontWeight: 700,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          {labels.name as string}
        </h1>
        <p
          style={{
            fontSize: 32,
            opacity: 0.8,
            textAlign: "center",
            maxWidth: "80%",
          }}
        >
          {labels.description as string}
        </p>
        <span
          style={{
            fontSize: 24,
            marginTop: 40,
            opacity: 0.6,
          }}
        >
          Tool Center
        </span>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

**Step 2: Verify no TypeScript errors**

Run: `bun run tsc --noEmit`
Expected: No errors (may need to run generate first)

**Step 3: Commit**

```bash
git add app/api/og/[slug]/route.tsx
git commit -m "feat: add OG image generation API route"
```

---

## Phase 2: Migration

### Task 10: Create Migration Script

**Files:**
- Create: `scripts/migrate-tools.ts`

**Step 1: Write the migration script**

```typescript
// scripts/migrate-tools.ts
import * as fs from "fs";
import * as path from "path";

const TOOLS_DIR = path.join(process.cwd(), "components/tools");
const MESSAGES_DIR = path.join(process.cwd(), "messages");
const OLD_TOOLS_FILE = path.join(process.cwd(), "lib/tools.ts");

type OldToolDef = {
  slug: string;
  nameKey: string;
  descriptionKey: string;
  category: string;
  tags?: string[];
};

function loadOldTools(): OldToolDef[] {
  if (!fs.existsSync(OLD_TOOLS_FILE)) {
    console.error("Old tools.ts not found");
    return [];
  }

  const content = fs.readFileSync(OLD_TOOLS_FILE, "utf-8");

  // Extract tools array using regex
  const toolsMatch = content.match(/export const tools[^=]*=\s*\[([\s\S]*?)\];/);
  if (!toolsMatch) {
    console.error("Could not parse tools array");
    return [];
  }

  const tools: OldToolDef[] = [];
  const toolBlocks = toolsMatch[1].split(/\},\s*\{/);

  for (const block of toolBlocks) {
    const slugMatch = block.match(/slug:\s*["']([^"']+)["']/);
    const nameKeyMatch = block.match(/nameKey:\s*["']([^"']+)["']/);
    const descKeyMatch = block.match(/descriptionKey:\s*["']([^"']+)["']/);
    const categoryMatch = block.match(/category:\s*["']([^"']+)["']/);
    const tagsMatch = block.match(/tags:\s*\[([^\]]*)\]/);

    if (slugMatch && nameKeyMatch && descKeyMatch && categoryMatch) {
      const tool: OldToolDef = {
        slug: slugMatch[1],
        nameKey: nameKeyMatch[1],
        descriptionKey: descKeyMatch[1],
        category: categoryMatch[1],
      };

      if (tagsMatch) {
        tool.tags = tagsMatch[1]
          .split(",")
          .map((t) => t.trim().replace(/["']/g, ""))
          .filter(Boolean);
      }

      tools.push(tool);
    }
  }

  return tools;
}

function loadMessages(locale: string): Record<string, unknown> {
  const messagesPath = path.join(MESSAGES_DIR, `${locale}.json`);
  if (!fs.existsSync(messagesPath)) return {};
  return JSON.parse(fs.readFileSync(messagesPath, "utf-8"));
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce((acc: unknown, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function migrateTool(tool: OldToolDef, enMessages: Record<string, unknown>, zhMessages: Record<string, unknown>): void {
  const toolDir = path.join(TOOLS_DIR, tool.slug);
  const i18nDir = path.join(toolDir, "i18n");

  // Check if already migrated
  if (fs.existsSync(path.join(toolDir, "meta.ts"))) {
    console.log(`Skipping ${tool.slug} (already migrated)`);
    return;
  }

  // Check if component exists
  const possibleFiles = [
    `${tool.slug}.tsx`,
    `${tool.slug.replace(/-/g, "-")}.tsx`,
  ];

  let existingComponent: string | null = null;
  for (const file of possibleFiles) {
    const filePath = path.join(TOOLS_DIR, file);
    if (fs.existsSync(filePath)) {
      existingComponent = file;
      break;
    }
  }

  // Create directory structure
  if (!fs.existsSync(i18nDir)) {
    fs.mkdirSync(i18nDir, { recursive: true });
  }

  // Move component if it exists as a file
  if (existingComponent) {
    const oldPath = path.join(TOOLS_DIR, existingComponent);
    const newPath = path.join(toolDir, "index.tsx");

    if (!fs.existsSync(newPath)) {
      const content = fs.readFileSync(oldPath, "utf-8");
      fs.writeFileSync(newPath, content);
      console.log(`  Copied ${existingComponent} -> ${tool.slug}/index.tsx`);
    }
  }

  // Create meta.ts
  const metaContent = `import type { ToolMeta } from "@/lib/tool-types";

export const meta: ToolMeta = {
  slug: "${tool.slug}",
  category: "${tool.category}",
  tags: ${JSON.stringify(tool.tags || [])},
  icon: "Wrench", // TODO: Update icon
  seo: {
    keywords: [], // TODO: Add SEO keywords
  },
};
`;
  fs.writeFileSync(path.join(toolDir, "meta.ts"), metaContent);

  // Extract translations from messages
  const toolKey = tool.slug.replace(/-/g, "");
  const enToolData = getNestedValue(enMessages, `tools.${tool.slug}`) as Record<string, unknown> | undefined
    || getNestedValue(enMessages, `tools.${toolKey}`) as Record<string, unknown> | undefined
    || {};
  const zhToolData = getNestedValue(zhMessages, `tools.${tool.slug}`) as Record<string, unknown> | undefined
    || getNestedValue(zhMessages, `tools.${toolKey}`) as Record<string, unknown> | undefined
    || {};

  // Also check for tool-specific sections (like base64, jsonFormatter, etc.)
  const enExtra = getNestedValue(enMessages, tool.slug.replace(/-/g, "")) as Record<string, unknown> | undefined
    || getNestedValue(enMessages, toolKey) as Record<string, unknown> | undefined
    || {};
  const zhExtra = getNestedValue(zhMessages, tool.slug.replace(/-/g, "")) as Record<string, unknown> | undefined
    || getNestedValue(zhMessages, toolKey) as Record<string, unknown> | undefined
    || {};

  const enLabels = { ...enToolData, ...enExtra };
  const zhLabels = { ...zhToolData, ...zhExtra };

  // Ensure name and description exist
  if (!enLabels.name) enLabels.name = tool.slug;
  if (!enLabels.description) enLabels.description = "";
  if (!zhLabels.name) zhLabels.name = enLabels.name;
  if (!zhLabels.description) zhLabels.description = enLabels.description;

  fs.writeFileSync(
    path.join(i18nDir, "en.json"),
    JSON.stringify(enLabels, null, 2)
  );
  fs.writeFileSync(
    path.join(i18nDir, "zh.json"),
    JSON.stringify(zhLabels, null, 2)
  );

  console.log(`Migrated: ${tool.slug}`);
}

function main(): void {
  console.log("Loading old tool definitions...");
  const tools = loadOldTools();
  console.log(`Found ${tools.length} tools to migrate\n`);

  const enMessages = loadMessages("en");
  const zhMessages = loadMessages("zh");

  for (const tool of tools) {
    migrateTool(tool, enMessages, zhMessages);
  }

  console.log("\nMigration complete!");
  console.log("Next steps:");
  console.log("  1. Review migrated tools in components/tools/*/");
  console.log("  2. Add SEO keywords to each meta.ts");
  console.log("  3. Update icons in each meta.ts");
  console.log("  4. Run: bun run tool:validate");
  console.log("  5. Run: bun run generate");
}

main();
```

**Step 2: Run migration**

Run: `bun scripts/migrate-tools.ts`
Expected: Migrates all 44 tools, creating folder structure

**Step 3: Verify migration**

Run: `ls components/tools/base64/`
Expected: index.tsx, meta.ts, i18n/

**Step 4: Run validation**

Run: `bun run tool:validate`
Expected: Some warnings about keywords (OK), no errors

**Step 5: Run generation**

Run: `bun run generate`
Expected: "Generated registry with 44 tools"

**Step 6: Commit**

```bash
git add scripts/migrate-tools.ts
git add components/tools/*/
git commit -m "feat: migrate 44 existing tools to plugin architecture"
```

---

## Phase 3: Integration

### Task 11: Update Tool Page to Use New Loader

**Files:**
- Modify: `app/[locale]/tools/[slug]/page.tsx`

**Step 1: Rewrite page.tsx to use dynamic loading**

Replace the entire file with:

```tsx
// app/[locale]/tools/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ToolShell } from "@/components/tool-shell";
import { ToolJsonLd } from "@/components/tool-json-ld";
import { clientEnv } from "@/lib/env";
import { assertLocale, locales } from "@/lib/i18n-config";
import { toolRegistry, toolLoaders, toolSlugs } from "@/lib/generated/tool-registry";
import { getToolLabels } from "@/lib/generated/tool-i18n";
import type { ToolLabels } from "@/lib/tool-types";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return toolSlugs.flatMap((slug) =>
    locales.map((locale) => ({ slug, locale }))
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

export default async function ToolPage({ params }: Props) {
  const { slug, locale: raw } = await params;
  const locale = assertLocale(raw);
  const tool = toolRegistry[slug];

  if (!tool) {
    notFound();
  }

  const loader = toolLoaders[slug];
  if (!loader) {
    notFound();
  }

  const [module, labels] = await Promise.all([
    loader(),
    Promise.resolve(getToolLabels(slug, locale) as ToolLabels | null),
  ]);

  if (!module || !labels) {
    notFound();
  }

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

**Step 2: Verify build works**

Run: `bun run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add app/[locale]/tools/[slug]/page.tsx
git commit -m "refactor: replace switch statement with dynamic tool loader"
```

---

### Task 12: Update Sitemap

**Files:**
- Modify: `app/sitemap.ts`

**Step 1: Update sitemap to use generated registry**

```typescript
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
```

**Step 2: Verify build**

Run: `bun run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add app/sitemap.ts
git commit -m "refactor: update sitemap to use generated tool registry"
```

---

### Task 13: Update Home Page and Header to Use New Registry

**Files:**
- Modify: `app/[locale]/page.tsx`
- Modify: `components/site-header.tsx`

**Step 1: Check current usage and update imports**

First read the files to understand current usage, then update to import from generated registry instead of old lib/tools.ts.

**Step 2: Verify build**

Run: `bun run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add app/[locale]/page.tsx components/site-header.tsx
git commit -m "refactor: update home page and header to use generated registry"
```

---

### Task 14: Clean Up Old Files

**Files:**
- Delete: `lib/tools.ts` (after verifying no imports remain)
- Modify: `messages/en.json` (remove tool-specific translations — optional, can keep for backward compat)
- Modify: `messages/zh.json` (remove tool-specific translations — optional)

**Step 1: Verify no remaining imports of old tools.ts**

Run: `grep -r "from.*lib/tools" --include="*.ts" --include="*.tsx" | grep -v node_modules | grep -v ".worktrees"`
Expected: No matches (or only the old file itself)

**Step 2: Delete old tools.ts**

Run: `rm lib/tools.ts`

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove old lib/tools.ts, now using generated registry"
```

---

## Phase 4: Validation

### Task 15: Full Test Suite

**Step 1: Run unit tests**

Run: `bun run test:unit`
Expected: All tests pass

**Step 2: Run validation**

Run: `bun run tool:validate`
Expected: All tools valid (warnings OK)

**Step 3: Run build**

Run: `bun run build`
Expected: Build succeeds

**Step 4: Start dev server and test a few tools**

Run: `bun run dev`
Test: Visit http://localhost:3000/en/tools/base64
Expected: Tool loads and works

**Step 5: Test OG image generation**

Test: Visit http://localhost:3000/api/og/base64?locale=en
Expected: Returns a 1200x630 image

**Step 6: View page source for JSON-LD**

Test: View source of http://localhost:3000/en/tools/base64
Expected: Contains `<script type="application/ld+json">` with WebApplication schema

---

### Task 16: Final Commit and Summary

**Step 1: Commit any remaining changes**

```bash
git add -A
git commit -m "chore: final cleanup for plugin architecture migration"
```

**Step 2: Summary of changes**

- ✅ 44 tools migrated to plugin architecture
- ✅ Each tool is self-contained (component + meta + i18n)
- ✅ Auto-discovery via build script
- ✅ Dynamic imports (no more switch statement)
- ✅ JSON-LD structured data on all tool pages
- ✅ OG image generation API
- ✅ Enhanced metadata with keywords, canonical, hreflang
- ✅ Updated sitemap with lastmod

---

## Success Criteria Checklist

- [ ] Adding a new tool requires only creating one folder with 4 files
- [ ] No manual imports or switch statements needed
- [ ] All tools have OG images for social sharing
- [ ] All tool pages have JSON-LD structured data
- [ ] Sitemap includes all tools with proper metadata
- [ ] Build fails if tool is incomplete (missing translations, etc.)
- [ ] Existing 44 tools work identically after migration
- [ ] All unit tests pass
