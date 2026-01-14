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
  "conversion",
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
