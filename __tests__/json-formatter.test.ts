import { describe, expect, it } from "vitest";

import { formatJsonErrorMessage, formatJsonInput, validateJsonInput } from "@/lib/json-formatter";

describe("json formatter helpers", () => {
  it("formats valid JSON", () => {
    const result = formatJsonInput("{\"a\":1}", "Error");
    expect(result.status).toBe("valid");
    expect(result.formatted).toBe("{\n  \"a\": 1\n}");
  });

  it("returns empty status for blank input", () => {
    const result = formatJsonInput("   ", "Error");
    expect(result.status).toBe("empty");
  });

  it("formats error message with line and column", () => {
    const input = "abc\ndef";
    const message = "Unexpected token x in JSON at position 5";
    const result = formatJsonErrorMessage(message, input, "Invalid JSON");
    expect(result).toBe("Invalid JSON (line 2, column 2)");
  });

  it("validates invalid JSON", () => {
    const result = validateJsonInput("{", "Error");
    expect(result.status).toBe("invalid");
    expect(result.error).toContain("Error");
  });
});
