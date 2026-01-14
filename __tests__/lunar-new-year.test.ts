import { describe, expect, it } from "vitest";

import { getDaysUntil, getNextLunarNewYearDate, pickGreeting } from "@/lib/lunar-new-year";

describe("lunar new year helpers", () => {
  it("picks the next lunar new year date", () => {
    const reference = new Date("2025-01-01T12:00:00Z");
    const next = getNextLunarNewYearDate(reference, ["2025-01-29", "2026-02-17"]);
    expect(next.getFullYear()).toBe(2025);
    expect(next.getMonth()).toBe(0);
    expect(next.getDate()).toBe(29);
  });

  it("computes days until target", () => {
    const reference = new Date("2025-01-01T00:00:00Z");
    const target = new Date("2025-01-29T00:00:00Z");
    expect(getDaysUntil(reference, target)).toBe(28);
  });

  it("picks greetings deterministically", () => {
    const greeting = pickGreeting(["a", "b", "c"], () => 0.4);
    expect(greeting).toBe("b");
  });
});
