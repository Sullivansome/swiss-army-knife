import { describe, expect, it } from "vitest";

import { buildLoremParagraphs, generateLoremIpsum } from "@/lib/lorem-ipsum";

describe("lorem ipsum helpers", () => {
  it("builds paragraph blocks from words", () => {
    const words = ["one", "two", "three", "four", "five", "six"];
    const result = buildLoremParagraphs(words, 2, 3);
    expect(result).toBe("one two three\n\nfour five six");
  });

  it("generates paragraphs with a custom generator", () => {
    const generator = {
      generateWords: (count: number) =>
        Array.from({ length: count }, (_, i) => `w${i + 1}`).join(" "),
    };
    const result = generateLoremIpsum(2, 2, generator);
    expect(result).toBe("w1 w2\n\nw3 w4");
  });
});
