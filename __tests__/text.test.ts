import { describe, expect, it } from "vitest";

import { buildDiff, convertCase, getTextStats } from "@/lib/text";

describe("getTextStats", () => {
  it("counts characters, words, and lines", () => {
    const stats = getTextStats("hello world\nline2");
    expect(stats.characters).toBe(17);
    expect(stats.words).toBe(3);
    expect(stats.lines).toBe(2);
  });
});

describe("convertCase", () => {
  it("converts to camel case", () => {
    expect(convertCase("hello world", "camel")).toBe("helloWorld");
    expect(convertCase("hello_world", "camel")).toBe("helloWorld");
  });

  it("converts to snake", () => {
    expect(convertCase("Hello World", "snake")).toBe("hello_world");
  });

  it("converts to title", () => {
    expect(convertCase("hello-world", "title")).toBe("Hello World");
  });
});

describe("buildDiff", () => {
  it("detects additions and removals", () => {
    const diff = buildDiff("a\nb", "a\nc");
    const added = diff.find((d) => d.added)?.value.trim();
    const removed = diff.find((d) => d.removed)?.value.trim();
    expect(added).toBe("c");
    expect(removed).toBe("b");
  });
});
