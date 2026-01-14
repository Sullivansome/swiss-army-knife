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
  | "conversion";

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
    slug: "json-formatter",
    nameKey: "tools.jsonFormatter.name",
    descriptionKey: "tools.jsonFormatter.description",
    category: "dev",
    tags: ["json", "format", "validate"],
  },
  {
    slug: "regex-playground",
    nameKey: "tools.regexPlayground.name",
    descriptionKey: "tools.regexPlayground.description",
    category: "dev",
    tags: ["regex", "test"],
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
  {
    slug: "password-generator",
    nameKey: "tools.passwordGenerator.name",
    descriptionKey: "tools.passwordGenerator.description",
    category: "security",
    tags: ["random", "password"],
  },
  {
    slug: "uuid-generator",
    nameKey: "tools.uuidGenerator.name",
    descriptionKey: "tools.uuidGenerator.description",
    category: "dev",
    tags: ["uuid", "random", "generate"],
  },
  {
    slug: "hash-generator",
    nameKey: "tools.hashGenerator.name",
    descriptionKey: "tools.hashGenerator.description",
    category: "security",
    tags: ["hash", "md5", "sha"],
  },
  {
    slug: "jwt-inspector",
    nameKey: "tools.jwtInspector.name",
    descriptionKey: "tools.jwtInspector.description",
    category: "security",
    tags: ["jwt", "token", "decode"],
  },
  {
    slug: "qr-generator",
    nameKey: "tools.qrGenerator.name",
    descriptionKey: "tools.qrGenerator.description",
    category: "media",
    tags: ["qr", "encode"],
  },
  {
    slug: "exif-viewer",
    nameKey: "tools.exifViewer.name",
    descriptionKey: "tools.exifViewer.description",
    category: "media",
    tags: ["exif", "metadata"],
  },
  {
    slug: "color-converter",
    nameKey: "tools.colorConverter.name",
    descriptionKey: "tools.colorConverter.description",
    category: "media",
    tags: ["color", "convert"],
  },
  {
    slug: "color-contrast-checker",
    nameKey: "tools.colorContrast.name",
    descriptionKey: "tools.colorContrast.description",
    category: "design",
    tags: ["color", "contrast", "wcag"],
  },
  {
    slug: "image-to-pdf",
    nameKey: "tools.image-to-pdf.name",
    descriptionKey: "tools.image-to-pdf.description",
    category: "productivity",
    tags: ["pdf", "image"],
  },
  {
    slug: "list-dedup-sort",
    nameKey: "tools.list-dedup-sort.name",
    descriptionKey: "tools.list-dedup-sort.description",
    category: "productivity",
    tags: ["list", "sort"],
  },
  {
    slug: "csv-json-converter",
    nameKey: "tools.csv-json-converter.name",
    descriptionKey: "tools.csv-json-converter.description",
    category: "productivity",
    tags: ["csv", "json", "convert"],
  },
  {
    slug: "random-picker",
    nameKey: "tools.random-picker.name",
    descriptionKey: "tools.random-picker.description",
    category: "productivity",
    tags: ["random", "team"],
  },
  {
    slug: "image-compressor",
    nameKey: "tools.image-compressor.name",
    descriptionKey: "tools.image-compressor.description",
    category: "design",
    tags: ["image", "compress"],
  },
  {
    slug: "image-converter",
    nameKey: "tools.image-converter.name",
    descriptionKey: "tools.image-converter.description",
    category: "design",
    tags: ["image", "convert"],
  },
  {
    slug: "social-mockup",
    nameKey: "tools.social-mockup.name",
    descriptionKey: "tools.social-mockup.description",
    category: "design",
    tags: ["social", "image"],
  },
  {
    slug: "palette-generator",
    nameKey: "tools.palette-generator.name",
    descriptionKey: "tools.palette-generator.description",
    category: "design",
    tags: ["color", "generate"],
  },
  {
    slug: "svg-recolor",
    nameKey: "tools.svg-recolor.name",
    descriptionKey: "tools.svg-recolor.description",
    category: "design",
    tags: ["svg", "color"],
  },
  {
    slug: "emoji-cleaner",
    nameKey: "tools.emoji-cleaner.name",
    descriptionKey: "tools.emoji-cleaner.description",
    category: "social",
    tags: ["emoji", "clean"],
  },
  {
    slug: "social-formatter",
    nameKey: "tools.social-formatter.name",
    descriptionKey: "tools.social-formatter.description",
    category: "social",
    tags: ["text", "format"],
  },
  {
    slug: "advanced-word-count",
    nameKey: "tools.advanced-word-count.name",
    descriptionKey: "tools.advanced-word-count.description",
    category: "social",
    tags: ["count", "text"],
  },
  {
    slug: "date-calculator",
    nameKey: "tools.date-calculator.name",
    descriptionKey: "tools.date-calculator.description",
    category: "life",
    tags: ["date", "time"],
  },
  {
    slug: "timezone-meeting-planner",
    nameKey: "tools.timezonePlanner.name",
    descriptionKey: "tools.timezonePlanner.description",
    category: "time",
    tags: ["timezone", "schedule"],
  },
  {
    slug: "finance-calculator",
    nameKey: "tools.finance-calculator.name",
    descriptionKey: "tools.finance-calculator.description",
    category: "life",
    tags: ["finance", "chart"],
  },
  {
    slug: "bmi-calculator",
    nameKey: "tools.bmi-calculator.name",
    descriptionKey: "tools.bmi-calculator.description",
    category: "life",
    tags: ["health"],
  },
  {
    slug: "unit-converter",
    nameKey: "tools.unit-converter.name",
    descriptionKey: "tools.unit-converter.description",
    category: "life",
    tags: ["convert"],
  },
  {
    slug: "statistics-summary",
    nameKey: "tools.statisticsSummary.name",
    descriptionKey: "tools.statisticsSummary.description",
    category: "math",
    tags: ["stats", "analysis"],
  },
  {
    slug: "international-temperature-converter",
    nameKey: "tools.international-temperature-converter.name",
    descriptionKey: "tools.international-temperature-converter.description",
    category: "conversion",
    tags: ["convert"],
  },
  {
    slug: "family-relation-calculator",
    nameKey: "tools.family-relation-calculator.name",
    descriptionKey: "tools.family-relation-calculator.description",
    category: "conversion",
    tags: ["convert"],
  },
  {
    slug: "lunar-new-year-essentials",
    nameKey: "tools.lunar-new-year-essentials.name",
    descriptionKey: "tools.lunar-new-year-essentials.description",
    category: "conversion",
    tags: ["convert"],
  },
  {
    slug: "finance-number-case-converter",
    nameKey: "tools.finance-number-case-converter.name",
    descriptionKey: "tools.finance-number-case-converter.description",
    category: "conversion",
    tags: ["finance", "convert"],
  },
  {
    slug: "finance-essentials",
    nameKey: "tools.finance-essentials.name",
    descriptionKey: "tools.finance-essentials.description",
    category: "conversion",
    tags: ["finance"],
  },
  {
    slug: "base-converter",
    nameKey: "tools.base-converter.name",
    descriptionKey: "tools.base-converter.description",
    category: "conversion",
    tags: ["convert"],
  },
  {
    slug: "computer-base-converter",
    nameKey: "tools.computer-base-converter.name",
    descriptionKey: "tools.computer-base-converter.description",
    category: "conversion",
    tags: ["convert"],
  },
  {
    slug: "cron-explainer",
    nameKey: "tools.cronExplainer.name",
    descriptionKey: "tools.cronExplainer.description",
    category: "dev",
    tags: ["cron", "schedule"],
  },
  {
    slug: "video-to-gif",
    nameKey: "tools.video-to-gif.name",
    descriptionKey: "tools.video-to-gif.description",
    category: "wasm",
    tags: ["video", "gif"],
    requiresBackend: false,
  },
  {
    slug: "ocr",
    nameKey: "tools.ocr.name",
    descriptionKey: "tools.ocr.description",
    category: "wasm",
    tags: ["ocr", "text"],
  },
];

export const toolSlugs = tools.map((tool) => tool.slug);

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}
