import { getTool, toolSlugs } from "@/lib/tools";

describe("tools catalog", () => {
  const conversionTools = [
    {
      slug: "international-temperature-converter",
      nameKey: "tools.international-temperature-converter.name",
      descriptionKey: "tools.international-temperature-converter.description",
      tags: ["convert"],
    },
    {
      slug: "family-relation-calculator",
      nameKey: "tools.family-relation-calculator.name",
      descriptionKey: "tools.family-relation-calculator.description",
      tags: ["convert"],
    },
    {
      slug: "lunar-new-year-essentials",
      nameKey: "tools.lunar-new-year-essentials.name",
      descriptionKey: "tools.lunar-new-year-essentials.description",
      tags: ["convert"],
    },
    {
      slug: "finance-number-case-converter",
      nameKey: "tools.finance-number-case-converter.name",
      descriptionKey: "tools.finance-number-case-converter.description",
      tags: ["finance", "convert"],
    },
    {
      slug: "finance-essentials",
      nameKey: "tools.finance-essentials.name",
      descriptionKey: "tools.finance-essentials.description",
      tags: ["finance"],
    },
    {
      slug: "base-converter",
      nameKey: "tools.base-converter.name",
      descriptionKey: "tools.base-converter.description",
      tags: ["convert"],
    },
    {
      slug: "computer-base-converter",
      nameKey: "tools.computer-base-converter.name",
      descriptionKey: "tools.computer-base-converter.description",
      tags: ["convert"],
    },
  ];

  it("registers all data conversion tools with translation keys", () => {
    conversionTools.forEach(({ slug, nameKey, descriptionKey }) => {
      expect(toolSlugs).toContain(slug);
      const tool = getTool(slug);
      expect(tool).toMatchObject({
        slug,
        nameKey,
        descriptionKey,
        category: "数据换算",
      });
    });
  });

  it("keeps tag coverage for finance-specific utilities", () => {
    const financeTools = conversionTools.filter((tool) =>
      tool.tags.includes("finance"),
    );

    financeTools.forEach(({ slug, tags }) => {
      const tool = getTool(slug);
      expect(tool?.tags).toBeDefined();
      tags.forEach((tag) => {
        expect(tool?.tags).toContain(tag);
      });
    });
  });
});
