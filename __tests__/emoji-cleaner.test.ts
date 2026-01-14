import { describe, expect, it } from "vitest";

import { extractEmojis, removeEmojis } from "@/lib/emoji-cleaner";

describe("emoji cleaner helpers", () => {
  it("extracts and removes emojis", () => {
    const input = "Hello 😊🚀";
    expect(extractEmojis(input)).toEqual(["😊", "🚀"]);
    expect(removeEmojis(input)).toBe("Hello ");
  });
});
