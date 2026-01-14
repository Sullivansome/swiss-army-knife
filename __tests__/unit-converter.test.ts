import { describe, expect, it } from "vitest";

import { clothingTable, convertUnits, lengthUnits, shoeTable, weightUnits } from "@/lib/unit-converter";

describe("unit converter helpers", () => {
  it("converts length units", () => {
    const result = convertUnits(100, "cm", lengthUnits);
    const meters = result.find((item) => item.key === "m");
    expect(meters?.value).toBe(1);
  });

  it("converts weight units", () => {
    const result = convertUnits(1, "kg", weightUnits);
    const grams = result.find((item) => item.key === "g");
    expect(grams?.value).toBe(1000);
  });

  it("exposes size tables", () => {
    expect(shoeTable.length).toBeGreaterThan(0);
    expect(clothingTable.length).toBeGreaterThan(0);
  });
});
