import {
  normalizeQrSize,
  getContrastRatio,
  MIN_CONTRAST_RATIO,
  PNG_SIZES,
  EXPORT_FORMATS,
} from "@/lib/qr";

describe("QR Utilities", () => {
  describe("normalizeQrSize", () => {
    it("returns value within range", () => {
      expect(normalizeQrSize(250)).toBe(250);
    });

    it("clamps value below minimum", () => {
      expect(normalizeQrSize(50)).toBe(100);
    });

    it("clamps value above maximum", () => {
      expect(normalizeQrSize(600)).toBe(500);
    });

    it("returns fallback for NaN", () => {
      expect(normalizeQrSize(NaN)).toBe(200);
    });

    it("returns fallback for Infinity", () => {
      expect(normalizeQrSize(Infinity)).toBe(200);
    });

    it("uses custom min/max/fallback", () => {
      expect(normalizeQrSize(50, 200, 400, 300)).toBe(200);
      expect(normalizeQrSize(500, 200, 400, 300)).toBe(400);
      expect(normalizeQrSize(NaN, 200, 400, 300)).toBe(300);
    });
  });

  describe("getContrastRatio", () => {
    it("returns 21 for black on white", () => {
      const ratio = getContrastRatio("#000000", "#FFFFFF");
      expect(ratio).toBeCloseTo(21, 0);
    });

    it("returns 21 for white on black", () => {
      const ratio = getContrastRatio("#FFFFFF", "#000000");
      expect(ratio).toBeCloseTo(21, 0);
    });

    it("returns 1 for same colors", () => {
      const ratio = getContrastRatio("#FF0000", "#FF0000");
      expect(ratio).toBeCloseTo(1, 0);
    });

    it("calculates contrast for custom colors", () => {
      // Ocean preset: #0369a1 on #e0f2fe
      const ratio = getContrastRatio("#0369a1", "#e0f2fe");
      expect(ratio).toBeGreaterThan(MIN_CONTRAST_RATIO);
    });

    it("handles colors without hash", () => {
      const ratio = getContrastRatio("000000", "FFFFFF");
      expect(ratio).toBeCloseTo(21, 0);
    });
  });

  describe("Constants", () => {
    it("has correct PNG sizes", () => {
      expect(PNG_SIZES).toEqual([512, 1024, 2048]);
    });

    it("has correct export formats", () => {
      expect(EXPORT_FORMATS).toEqual(["png", "svg"]);
    });

    it("has minimum contrast ratio of 3", () => {
      expect(MIN_CONTRAST_RATIO).toBe(3);
    });
  });
});
