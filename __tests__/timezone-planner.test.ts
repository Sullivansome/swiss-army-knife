import { describe, expect, it } from "vitest";

import { buildTimeline, buildTimelineSummary } from "@/lib/timezone-planner";

describe("timezone planner helpers", () => {
  it("builds timeline entries", () => {
    const baseDate = new Date("2024-01-01T12:00:00Z");
    const timeline = buildTimeline(
      baseDate,
      [{ id: "base", zone: "UTC", isBase: true }],
      "en-US",
    );
    expect(timeline).toHaveLength(1);
    expect(timeline[0].label).toContain("UTC");
    expect(timeline[0].hour).toBe(12);
    expect(timeline[0].workFriendly).toBe(true);
  });

  it("builds summary text", () => {
    const summary = buildTimelineSummary([
      {
        id: "base",
        zone: "UTC",
        label: "UTC",
        formatted: "Jan 1",
        hour: 12,
        workFriendly: true,
        isBase: true,
      },
    ]);
    expect(summary).toBe("UTC: Jan 1");
  });
});
