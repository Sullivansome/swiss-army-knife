export type ToolCategory = "dev" | "text" | "security" | "media" | "time" | "math";

export type ToolDefinition = {
  slug: string;
  nameKey: string;
  descriptionKey: string;
  category: ToolCategory;
  tags?: string[];
  requiresBackend?: boolean;
};

export const tools: ToolDefinition[] = [
  {
    slug: "base64",
    nameKey: "tools.base64.name",
    descriptionKey: "tools.base64.description",
    category: "text",
    tags: ["encode", "decode"],
  },
];

export const toolSlugs = tools.map((tool) => tool.slug);

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}
