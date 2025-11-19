import { describe, expect, it } from "vitest";

import { getDateDiffStats } from "@/lib/date-calculator";

describe("getDateDiffStats", () => {
  it("calculates future ranges", () => {
    const stats = getDateDiffStats("2024-01-01", "2024-01-11");
    expect(stats).toEqual({ days: 10, weeks: 1, months: 0, isFuture: true });
  });

  it("calculates past ranges", () => {
    const stats = getDateDiffStats("2024-01-15", "2024-01-01");
    expect(stats).toEqual({ days: 14, weeks: 2, months: 0, isFuture: false });
  });

  it("returns null for invalid dates", () => {
    expect(getDateDiffStats("", "2024-01-01")).toBeNull();
    expect(getDateDiffStats("2024-01-01", "invalid")).toBeNull();
  });
});
