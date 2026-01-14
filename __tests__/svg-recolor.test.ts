import { describe, expect, it } from "vitest";

import { recolorSvgSource } from "@/lib/svg-recolor";

describe("svg recolor helpers", () => {
  it("recolors fill and stroke while preserving none", () => {
    const input = '<svg><path fill="#123" stroke="#456" /><path fill="none" stroke="#999"/></svg>';
    const output = recolorSvgSource(input, "#ff0000");
    expect(output).toContain('fill="#ff0000"');
    expect(output).toContain('stroke="#ff0000"');
    expect(output).toContain('fill="none"');
  });

  it("adds a fill to the root when missing", () => {
    const input = "<svg><rect width=\"10\" height=\"10\" /></svg>";
    const output = recolorSvgSource(input, "#00ff00");
    expect(output).toContain('<svg fill="#00ff00"');
  });
});
