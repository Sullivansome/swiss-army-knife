import { describe, expect, it } from "vitest";

import {
  calculateFinanceSummary,
  calculateTaxBreakdown,
  splitExpenses,
  toChineseUppercase,
} from "@/lib/finance";

describe("calculateFinanceSummary", () => {
  it("tracks yearly points and totals", () => {
    const summary = calculateFinanceSummary(1000, 100, 6, 2);
    expect(summary.points).toHaveLength(2);
    // first year grows principal plus contributions + interest
    expect(summary.points[0].year).toBe(1);
    expect(summary.points[0].contributed).toBe(2200);
    expect(summary.points[0].balance).toBeGreaterThan(
      summary.points[0].contributed,
    );

    expect(summary.totalContributions).toBe(3400);
    expect(summary.totalInterest).toBe(
      summary.points.at(-1)!.balance - summary.totalContributions,
    );
  });

  it("handles zero rates", () => {
    const summary = calculateFinanceSummary(0, 100, 0, 1);
    expect(summary.points[0].balance).toBe(1200);
    expect(summary.totalInterest).toBe(0);
  });
});

describe("finance helpers", () => {
  it("converts to uppercase Chinese numerals", () => {
    expect(toChineseUppercase(0)).toBe("零元整");
    expect(toChineseUppercase(1234.56)).toBe("壹仟贰佰叁拾肆元伍角陆分");
  });

  it("calculates tax breakdown", () => {
    const result = calculateTaxBreakdown(1000, 6);
    expect(result.tax).toBe(60);
    expect(result.total).toBe(1060);
  });

  it("splits expenses", () => {
    const result = splitExpenses(2400, 4, 3);
    expect(result.perPerson).toBe(600);
    expect(result.perDay).toBe(800);
    expect(result.perPersonPerDay).toBe(200);
  });
});
