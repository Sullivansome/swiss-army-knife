import { describe, expect, it } from "vitest";

import { processList } from "@/lib/list-utils";

describe("processList", () => {
  const sample = "alice\nBob\nalice\n bob \n";

  it("deduplicates case-insensitively by default", () => {
    expect(processList(sample, false, "none")).toEqual(["alice", "Bob"]);
  });

  it("respects case sensitivity", () => {
    expect(processList(sample, true, "none")).toEqual(["alice", "Bob", "bob"]);
  });

  it("sorts ascending and descending", () => {
    expect(processList(sample, false, "asc")).toEqual(["alice", "Bob"]);
    expect(processList(sample, false, "desc")).toEqual(["Bob", "alice"]);
  });
});
