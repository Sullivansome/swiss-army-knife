import { describe, expect, it } from "vitest";

import { formatContrastRatio, getContrastRatio, parseHex } from "@/lib/color-contrast";

describe("color contrast helpers", () => {
  it("parses hex colors", () => {
    expect(parseHex("#fff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseHex("#3366ff")).toEqual({ r: 51, g: 102, b: 255 });
    expect(parseHex("invalid")).toBeNull();
  });

  it("calculates contrast ratio", () => {
    const ratio = getContrastRatio("#000000", "#ffffff");
    expect(ratio).toBeGreaterThan(20);
    expect(formatContrastRatio(ratio)).toBe("21.00:1");
  });

  it("formats missing ratio", () => {
    expect(formatContrastRatio(null)).toBe("–");
  });
});
