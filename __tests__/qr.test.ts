import { describe, expect, it } from "vitest";

import { normalizeQrSize, QR_DOWNLOAD_NAME } from "@/lib/qr";

describe("qr helpers", () => {
  it("normalizes size within bounds", () => {
    expect(normalizeQrSize(50)).toBe(100);
    expect(normalizeQrSize(600)).toBe(500);
    expect(normalizeQrSize(250)).toBe(250);
  });

  it("falls back on invalid values", () => {
    expect(normalizeQrSize(Number.NaN)).toBe(200);
  });

  it("uses a consistent download name", () => {
    expect(QR_DOWNLOAD_NAME).toBe("qr-code.png");
  });
});
