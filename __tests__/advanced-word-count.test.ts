import { describe, expect, it } from "vitest";

import { computeAdvancedWordStats } from "@/lib/advanced-word-count";

describe("advanced word count helpers", () => {
  it("computes text stats", () => {
    const stats = computeAdvancedWordStats("Hello world.\n\nSecond line!");
    expect(stats.charsWithSpaces).toBeGreaterThan(0);
    expect(stats.charsWithoutSpaces).toBeGreaterThan(0);
    expect(stats.words).toBe(4);
    expect(stats.sentences).toBe(2);
    expect(stats.paragraphs).toBe(2);
  });
});
