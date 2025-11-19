import { describe, expect, it } from "vitest";

import { resolveRelation } from "@/lib/family-relation";

describe("family relation resolver", () => {
  it("returns expected relations for direct family", () => {
    expect(resolveRelation(["father"])).toBe("father");
    expect(resolveRelation(["mother", "olderBrother"])).toBe("maternalUncle");
  });

  it("handles cousins and in-laws", () => {
    expect(resolveRelation(["father", "olderBrother", "son"])).toBe("cousin");
    expect(resolveRelation(["husband", "mother"])).toBe("motherInLaw");
    expect(resolveRelation(["son", "wife"])).toBe("daughterInLaw");
  });

  it("returns null when unknown", () => {
    expect(resolveRelation([])).toBeNull();
    expect(resolveRelation(["father", "son", "son"])).toBeNull();
  });
});
