import { describe, expect, it } from "vitest";

import { fitImageToPage, moveItem, removeItem } from "@/lib/image-to-pdf";

describe("image-to-pdf helpers", () => {
  it("moves items within bounds", () => {
    expect(moveItem(["a", "b", "c"], 0, -1)).toEqual(["a", "b", "c"]);
    expect(moveItem(["a", "b", "c"], 0, 1)).toEqual(["b", "a", "c"]);
  });

  it("removes items", () => {
    expect(removeItem(["a", "b", "c"], 1)).toEqual(["a", "c"]);
  });

  it("fits images to the page", () => {
    const fit = fitImageToPage(200, 100, 100, 100);
    expect(fit.width).toBeCloseTo(100);
    expect(fit.height).toBeCloseTo(50);
    expect(fit.x).toBeCloseTo(0);
    expect(fit.y).toBeCloseTo(25);
  });
});
