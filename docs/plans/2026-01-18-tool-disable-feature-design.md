# Tool Disable Feature Design

**Date:** 2026-01-18  
**Status:** Approved

## Overview

Add ability to disable specific tools from appearing in the site before build. Disabled tools are excluded from registry entirely—no listings, search, subdomain routing, or bundle inclusion.

## Use Case

Occasional toggling of tools (seasonal tools like Lunar New Year, experimental features, broken tools pending fix).

## Design

### Config File

**Location:** `tools.config.json` at repo root

**Format:**
```json
{
  "tools": {
    "ocr": { "enabled": false },
    "video-to-gif": { "enabled": false }
  }
}
```

**Behavior:**
- Tools not listed → enabled by default
- Tools with `"enabled": false` → excluded from registry
- Missing or empty file → all tools enabled

**Future extensibility:** Format supports adding per-tool config later (icons, feature flags, etc.) without schema changes.

### Generator Script Changes

**File:** `scripts/generate-registry.ts`

Add config loading and filtering:

```ts
const TOOLS_CONFIG_PATH = path.join(process.cwd(), "tools.config.json");

type ToolConfig = { enabled?: boolean };
type ToolsConfig = { tools?: Record<string, ToolConfig> };

function loadToolsConfig(): ToolsConfig {
  if (!fs.existsSync(TOOLS_CONFIG_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(TOOLS_CONFIG_PATH, "utf-8"));
  } catch {
    console.warn("Warning: invalid tools.config.json; ignoring");
    return {};
  }
}

function isToolEnabled(slug: string, config: ToolsConfig): boolean {
  return config.tools?.[slug]?.enabled !== false;
}
```

Filter in main loop:

```ts
function generateRegistry(): void {
  const config = loadToolsConfig();
  // ...
  for (const folder of folders) {
    const meta = loadToolMeta(folder);
    if (!meta) continue;

    if (!isToolEnabled(meta.slug, config)) {
      console.log(`Skipping disabled tool: ${meta.slug}`);
      continue;
    }

    tools[meta.slug] = meta;
    // ...
  }
}
```

**Result:** Disabled tools excluded from `toolRegistry`, `toolLoaders`, `toolSlugs`, and `tool-i18n.ts`.

### Page Route Changes

**File:** `app/[locale]/tools/[slug]/page.tsx`

Add strict dynamic params:

```ts
export const dynamicParams = false;
```

Prevents on-demand generation of disabled tool routes—returns 404 immediately.

## Files Changed

| File | Change |
|------|--------|
| `tools.config.json` (new) | Config with disabled tools |
| `scripts/generate-registry.ts` | Config loading + filtering |
| `app/[locale]/tools/[slug]/page.tsx` | Add `dynamicParams = false` |

## Testing

1. Add tool to disabled list in `tools.config.json`
2. Run `bun run generate`
3. Verify tool missing from `lib/generated/tool-registry.ts`
4. Run `bun run build` to confirm build succeeds

## Effort Estimate

~30 minutes
