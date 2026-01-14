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
