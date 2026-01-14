import { describe, expect, it } from "vitest";

import {
  bigintBitLength,
  convertBase,
  convertFromDecimal,
  convertToDecimal,
  padBinary,
} from "@/lib/base";

describe("base conversion helpers", () => {
  it("converts between bases accurately", () => {
    expect(convertBase("1010", 2, 10)).toBe("10");
    expect(convertBase("ff", 16, 2)).toBe("11111111");
    expect(convertBase("-377", 8, 10)).toBe("-255");
  });

  it("parses to decimal without loss for large values", () => {
    const decimal = convertToDecimal("ffffffff", 16);
    expect(decimal.toString()).toBe("4294967295");
    expect(convertFromDecimal(decimal, 16)).toBe("ffffffff");
  });

  it("computes bit length and padding", () => {
    const decimal = convertToDecimal("ff", 16);
    expect(bigintBitLength(decimal)).toBe(8);
    expect(padBinary("1111", 8)).toBe("00001111");
    expect(padBinary("-101", 8)).toBe("-00000101");
  });
});
