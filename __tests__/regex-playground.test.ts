import { describe, expect, it } from "vitest";

import { analyzeRegexMatches } from "@/lib/regex-playground";

describe("regex playground helpers", () => {
  it("returns empty matches when pattern is empty", () => {
    const result = analyzeRegexMatches("", "g", "sample");
    expect(result.hasError).toBe(false);
    expect(result.matches).toHaveLength(0);
    expect(result.segments).toEqual([{ text: "sample", match: false }]);
  });

  it("flags invalid regex", () => {
    const result = analyzeRegexMatches("(", "g", "sample");
    expect(result.hasError).toBe(true);
  });

  it("captures matches and groups", () => {
    const result = analyzeRegexMatches("a(.)", "g", "abc");
    expect(result.hasError).toBe(false);
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0]).toMatchObject({ text: "ab", index: 0, groups: ["b"] });
    expect(result.segments.map((segment) => segment.text).join("")) .toBe("abc");
  });
});
