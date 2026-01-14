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
