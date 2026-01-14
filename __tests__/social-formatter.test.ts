import { describe, expect, it } from "vitest";

import { formatSocialText } from "@/lib/social-formatter";

describe("social formatter helpers", () => {
  it("formats text with emoji, bullets, and spacing", () => {
    const output = formatSocialText("a\nb", {
      emoji: "✨",
      useBullets: true,
      insertSpacing: true,
    });
    expect(output).toBe("• ✨ a\n\n• ✨ b");
  });

  it("formats text without bullets", () => {
    const output = formatSocialText("a", {
      emoji: "",
      useBullets: false,
      insertSpacing: false,
    });
    expect(output).toBe("a");
  });
});
