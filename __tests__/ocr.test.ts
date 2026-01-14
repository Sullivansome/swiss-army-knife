import { describe, expect, it } from "vitest";

import { formatOcrProgress, shouldResetWorker } from "@/lib/ocr";

describe("ocr helpers", () => {
  it("formats progress messages", () => {
    expect(formatOcrProgress("Processing", 0.42)).toBe("Processing 42%");
  });

  it("detects language changes", () => {
    expect(shouldResetWorker("eng", "chi_sim")).toBe(true);
    expect(shouldResetWorker("eng", "eng")).toBe(false);
  });
});
