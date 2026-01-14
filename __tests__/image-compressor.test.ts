import { describe, expect, it } from "vitest";

import { computeTargetSizeMB, formatCompressionRatio, formatFileSize } from "@/lib/image-compression";

describe("image compression helpers", () => {
  it("computes target size with minimum", () => {
    const size = computeTargetSizeMB(1024 * 1024, 0.1);
    expect(size).toBe(0.2);
    expect(computeTargetSizeMB(4 * 1024 * 1024, 0.5)).toBe(2);
  });

  it("formats file sizes", () => {
    expect(formatFileSize(1024)).toBe("1.0 KB");
  });

  it("formats compression ratios", () => {
    expect(formatCompressionRatio(100, 50)).toBe("50.0%");
  });
});
