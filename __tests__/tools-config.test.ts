import { toolRegistry, toolSlugs } from "@/lib/generated/tool-registry";

describe("tools catalog", () => {
  const conversionTools = [
    {
      slug: "international-temperature-converter",
      tags: ["convert"],
    },
    {
      slug: "family-relation-calculator",
      tags: ["convert"],
    },
    {
      slug: "lunar-new-year-essentials",
      tags: ["convert"],
    },
    {
      slug: "finance-number-case-converter",
      tags: ["finance", "convert"],
    },
    {
      slug: "finance-essentials",
      tags: ["finance"],
    },
    {
      slug: "base-converter",
      tags: ["convert"],
    },
    {
      slug: "computer-base-converter",
      tags: ["convert"],
    },
  ];

  it("registers all data conversion tools", () => {
    conversionTools.forEach(({ slug }) => {
      expect(toolSlugs).toContain(slug);
      const tool = toolRegistry[slug];
      expect(tool).toBeDefined();
      expect(tool?.slug).toBe(slug);
      expect(tool?.category).toBe("conversion");
    });
  });

  it("keeps tag coverage for finance-specific utilities", () => {
    const financeTools = conversionTools.filter((tool) =>
      tool.tags.includes("finance"),
    );

    financeTools.forEach(({ slug, tags }) => {
      const tool = toolRegistry[slug];
      expect(tool?.tags).toBeDefined();
      tags.forEach((tag) => {
        expect(tool?.tags).toContain(tag);
      });
    });
  });
});
