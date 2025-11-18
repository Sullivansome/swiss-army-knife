import { describe, expect, it } from "vitest";

import { computeHash } from "@/lib/hash";
import { generatePassword } from "@/lib/password";

describe("hash generator", () => {
  it("computes md5 and sha variants", async () => {
    expect(await computeHash("abc", "md5")).toBe("900150983cd24fb0d6963f7d28e17f72");
    expect(await computeHash("abc", "sha256")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
    expect(await computeHash("abc", "sha512")).toBe(
      "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f",
    );
  });
});

describe("password generator", () => {
  it("respects length and selected pools", () => {
    const pwd = generatePassword({ length: 12, useUppercase: true, useLowercase: false, useNumbers: false, useSymbols: false });
    expect(pwd).toMatch(/^[A-Z]{12}$/);

    const pwdMixed = generatePassword({ length: 20, useUppercase: true, useLowercase: true, useNumbers: true, useSymbols: true });
    expect(pwdMixed.length).toBe(20);
  });
});
