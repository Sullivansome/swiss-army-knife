import { describe, expect, it } from "vitest";

import { parseCsvToJson, parseJsonToCsv } from "@/lib/csv-json";

describe("csv-json helpers", () => {
  it("parses csv into JSON", () => {
    const result = parseCsvToJson("name,age\nAlice,30");
    expect(result).toEqual([{ name: "Alice", age: "30" }]);
  });

  it("formats json into csv", () => {
    const csv = parseJsonToCsv('[{"name":"Alice","age":30}]');
    expect(csv).toContain("name,age");
    expect(csv).toContain("Alice,30");
  });
});
