import { decodeBase64, encodeBase64 } from "@/lib/base64";

describe("base64 helpers", () => {
  it("encodes and decodes simple ASCII", () => {
    const input = "hello world";
    const encoded = encodeBase64(input);
    const decoded = decodeBase64(encoded);
    expect(encoded).toBe("aGVsbG8gd29ybGQ=");
    expect(decoded).toBe(input);
  });

  it("handles utf-8 characters", () => {
    const input = "工具中心";
    const encoded = encodeBase64(input);
    const decoded = decodeBase64(encoded);
    expect(decoded).toBe(input);
  });

  it("throws on invalid base64 input when decoding", () => {
    expect(() => decodeBase64("%%%")).toThrow();
  });
});
