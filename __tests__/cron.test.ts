import { describe, expect, it } from "vitest";

import { getNextRuns, parseCronExpression } from "@/lib/cron";

describe("cron parser", () => {
  it("parses ranges, steps, and names", () => {
    const schedule = parseCronExpression("*/15 9-17/2 * JAN-MAR MON-FRI");

    expect(schedule.minute.any).toBe(false);
    expect(schedule.minute.values.has(0)).toBe(true);
    expect(schedule.minute.values.has(45)).toBe(true);
    expect(schedule.hour.values.has(9)).toBe(true);
    expect(schedule.hour.values.has(10)).toBe(false);
    expect(schedule.month.values.has(1)).toBe(true);
    expect(schedule.month.values.has(4)).toBe(false);
    expect(schedule.dayOfWeek.values.has(1)).toBe(true);
    expect(schedule.dayOfWeek.values.has(6)).toBe(false);
  });

  it("computes next runs in the requested timezone", () => {
    const schedule = parseCronExpression("0 9 * * 1-5");
    const runs = getNextRuns(schedule, {
      count: 3,
      timeZone: "UTC",
      startDate: new Date("2024-01-01T00:00:00Z"),
    });

    expect(runs).toHaveLength(3);
    expect(runs[0].toISOString()).toBe("2024-01-01T09:00:00.000Z");
    expect(runs[1].toISOString()).toBe("2024-01-02T09:00:00.000Z");
    expect(runs[2].toISOString()).toBe("2024-01-03T09:00:00.000Z");
  });
});
