import { describe, expect, it } from "vitest";

import { hexToRgb, rgbToHex } from "@/lib/color";

describe("color conversion", () => {
  it("converts hex to rgb", () => {
    expect(hexToRgb("#3366ff")).toEqual({ r: 51, g: 102, b: 255 });
    expect(hexToRgb("#fff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb("invalid")).toBeNull();
  });

  it("converts rgb to hex", () => {
    expect(rgbToHex({ r: 51, g: 102, b: 255 })).toBe("#3366ff");
    expect(rgbToHex({ r: -1, g: 0, b: 0 })).toBeNull();
  });
});
