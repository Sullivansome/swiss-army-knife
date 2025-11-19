import { describe, expect, it } from "vitest";

import { calculateBmi } from "@/lib/bmi";

describe("calculateBmi", () => {
  it("computes bmi and category", () => {
    const underweight = calculateBmi(170, 50);
    expect(underweight.bmi).toBeCloseTo(17.3, 1);
    expect(underweight.category).toBe("underweight");

    expect(calculateBmi(170, 65).category).toBe("normal");
    expect(calculateBmi(170, 80).category).toBe("overweight");
    expect(calculateBmi(170, 95).category).toBe("obese");
  });

  it("handles invalid input", () => {
    expect(calculateBmi(0, 0)).toEqual({ bmi: 0, category: "normal" });
  });
});
