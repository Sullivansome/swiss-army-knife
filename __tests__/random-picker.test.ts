import { describe, expect, it } from "vitest";

import { buildGroups, parseEntries, pickWinners } from "@/lib/random-picker";

describe("random picker helpers", () => {
  const rng = () => 0.999;

  it("parses entries", () => {
    expect(parseEntries("a\n b \n\n c")).toEqual(["a", "b", "c"]);
  });

  it("picks winners deterministically with RNG", () => {
    const winners = pickWinners(["a", "b", "c"], 2, rng);
    expect(winners).toEqual(["a", "b"]);
  });

  it("builds groups deterministically", () => {
    const groups = buildGroups(["a", "b", "c", "d"], 2, rng);
    expect(groups).toEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });
});
