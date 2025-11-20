import { describe, expect, it } from "vitest";

import { computeSummaryStats, parseNumberList } from "@/lib/statistics";

describe("statistics helpers", () => {
  it("parses values and ignores invalid tokens", () => {
    const result = parseNumberList("1, 2, foo, 3.5\n4");
    expect(result.values).toEqual([1, 2, 3.5, 4]);
    expect(result.invalid).toBe(1);
  });

  it("computes summary stats", () => {
    const stats = computeSummaryStats([1, 2, 3, 4]);
    expect(stats).not.toBeNull();
    expect(stats?.count).toBe(4);
    expect(stats?.sum).toBe(10);
    expect(stats?.mean).toBe(2.5);
    expect(stats?.median).toBe(2.5);
    expect(stats?.min).toBe(1);
    expect(stats?.max).toBe(4);
    expect(stats?.variance).toBe(1.25);
    expect(stats?.stddev).toBeCloseTo(Math.sqrt(1.25));
  });
});
