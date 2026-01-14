import { describe, expect, it } from "vitest";

import { decodeJwtToken, formatDuration, formatJwtJson, template } from "@/lib/jwt";

describe("jwt helpers", () => {
  const encode = (value: Record<string, unknown>) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");

  it("decodes a valid JWT without signature", () => {
    const header = { alg: "none", typ: "JWT" };
    const payload = { sub: "123" };
    const token = `${encode(header)}.${encode(payload)}`;
    const decoded = decodeJwtToken(token, "invalid", "decode error");
    expect(decoded.status).toBe("ready");
    if (decoded.status === "ready") {
      expect(decoded.header).toMatchObject(header);
      expect(decoded.payload).toMatchObject(payload);
      expect(decoded.signature).toBeNull();
      expect(formatJwtJson(decoded.payload)).toContain("\"sub\"");
    }
  });

  it("returns errors for invalid tokens", () => {
    const decoded = decodeJwtToken("abc", "invalid", "decode error");
    expect(decoded.status).toBe("error");
    if (decoded.status === "error") {
      expect(decoded.message).toBe("invalid");
    }
  });

  it("formats durations", () => {
    const labels = { durationUnits: { days: "d", hours: "h", minutes: "m" } };
    const result = formatDuration(2 * 24 * 60 * 60000 + 3 * 60 * 60000 + 5 * 60000, labels);
    expect(result).toBe("2d 3h 5m");
  });

  it("replaces template tokens", () => {
    expect(template("in {count} days", { count: "3" })).toBe("in 3 days");
  });
});
