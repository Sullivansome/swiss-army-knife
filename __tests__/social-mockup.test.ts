import { describe, expect, it } from "vitest";

import { getMockupFilename, getMockupTheme } from "@/lib/social-mockup";

describe("social mockup helpers", () => {
  it("returns theme styles for twitter", () => {
    const theme = getMockupTheme("twitter");
    expect(theme.containerClass).toContain("#0f1419");
    expect(theme.backgroundColor).toBe("#0f1419");
  });

  it("returns theme styles for instagram", () => {
    const theme = getMockupTheme("instagram");
    expect(theme.containerClass).toContain("bg-white");
    expect(theme.backgroundColor).toBe("#ffffff");
  });

  it("builds download filenames", () => {
    expect(getMockupFilename("twitter")).toBe("twitter-mockup.png");
  });
});
