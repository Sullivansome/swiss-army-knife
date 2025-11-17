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
  {
    slug: "word-counter",
    nameKey: "tools.wordCounter.name",
    descriptionKey: "tools.wordCounter.description",
    category: "text",
    tags: ["count"],
  },
  {
    slug: "case-converter",
    nameKey: "tools.caseConverter.name",
    descriptionKey: "tools.caseConverter.description",
    category: "text",
    tags: ["format"],
  },
  {
    slug: "diff-checker",
    nameKey: "tools.diffChecker.name",
    descriptionKey: "tools.diffChecker.description",
    category: "text",
    tags: ["compare"],
  },
  {
    slug: "lorem-ipsum",
    nameKey: "tools.loremIpsum.name",
    descriptionKey: "tools.loremIpsum.description",
    category: "text",
    tags: ["generate"],
  },
  {
    slug: "markdown-preview",
    nameKey: "tools.markdownPreview.name",
    descriptionKey: "tools.markdownPreview.description",
    category: "text",
    tags: ["markdown", "preview"],
  },
];

export const toolSlugs = tools.map((tool) => tool.slug);

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}
