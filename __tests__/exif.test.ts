import { describe, expect, it } from "vitest";

import { formatExifDate } from "@/lib/exif";

describe("exif helpers", () => {
  it("formats date values", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    expect(formatExifDate(date)).toBe(date.toISOString());
    expect(formatExifDate("2024:01:01 12:00:00")).toBe("2024:01:01 12:00:00");
  });

  it("returns placeholder when missing", () => {
    expect(formatExifDate()).toBe("--");
  });
});
