import { describe, expect, it } from "vitest";

import { generatePalette, randomColor } from "@/lib/palette";

describe("palette helpers", () => {
  it("creates deterministic colors with RNG", () => {
    const rng = () => 0;
    expect(randomColor(rng)).toBe("#000000");
  });

  it("generates a palette of the requested size", () => {
    let index = 0;
    const values = [0, 0.5, 0.1, 0.9, 0.2];
    const rng = () => values[index++ % values.length];
    const palette = generatePalette(5, rng);
    expect(palette).toHaveLength(5);
    palette.forEach((color) => expect(color).toMatch(/^#[0-9A-F]{6}$/));
  });
});
