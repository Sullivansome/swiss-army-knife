import { describe, expect, it } from "vitest";

import { calculateFinanceSummary } from "@/lib/finance";

describe("calculateFinanceSummary", () => {
  it("tracks yearly points and totals", () => {
    const summary = calculateFinanceSummary(1000, 100, 6, 2);
    expect(summary.points).toHaveLength(2);
    // first year grows principal plus contributions + interest
    expect(summary.points[0].year).toBe(1);
    expect(summary.points[0].contributed).toBe(2200);
    expect(summary.points[0].balance).toBeGreaterThan(summary.points[0].contributed);

    expect(summary.totalContributions).toBe(3400);
    expect(summary.totalInterest).toBe(summary.points.at(-1)!.balance - summary.totalContributions);
  });

  it("handles zero rates", () => {
    const summary = calculateFinanceSummary(0, 100, 0, 1);
    expect(summary.points[0].balance).toBe(1200);
    expect(summary.totalInterest).toBe(0);
  });
});
