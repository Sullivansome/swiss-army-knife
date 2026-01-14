import { generateUuid, generateUuids } from "@/lib/uuid";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe("uuid helpers", () => {
  it("generates a valid v4 uuid", () => {
    const value = generateUuid();
    expect(value).toMatch(uuidRegex);
  });

  it("generates the requested amount", () => {
    const values = generateUuids(5);
    expect(values).toHaveLength(5);
    values.forEach((value) => expect(value).toMatch(uuidRegex));
  });

  it("falls back to at least one value when count is invalid", () => {
    const values = generateUuids(NaN);
    expect(values).toHaveLength(1);
    expect(values[0]).toMatch(uuidRegex);
  });
});
