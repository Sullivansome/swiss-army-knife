import { describe, expect, it } from "vitest";

import {
  parseEntries,
  pickMany,
  shuffleEntries,
  generateNumberRange,
  createPresetEntries,
  calculateWheelRotation,
  generateWheelColors,
  type Entry,
} from "@/lib/random-picker";

describe("random picker helpers", () => {
  it("parses entries into Entry objects", () => {
    const entries = parseEntries("a\n b \n\n c");
    expect(entries).toHaveLength(3);
    expect(entries.map((e) => e.label)).toEqual(["a", "b", "c"]);
    entries.forEach((entry) => {
      expect(entry).toHaveProperty("id");
      expect(entry).toHaveProperty("label");
    });
  });

  it("generates number ranges", () => {
    const entries = generateNumberRange(1, 5);
    expect(entries).toHaveLength(5);
    expect(entries.map((e) => e.label)).toEqual(["1", "2", "3", "4", "5"]);
  });

  it("creates preset entries", () => {
    const yesNo = createPresetEntries("yesno");
    expect(yesNo.map((e) => e.label)).toEqual(["Yes", "No"]);

    const coin = createPresetEntries("coin");
    expect(coin.map((e) => e.label)).toEqual(["Heads", "Tails"]);

    const d6 = createPresetEntries("d6");
    expect(d6).toHaveLength(6);
  });

  it("shuffles entries", () => {
    const entries: Entry[] = [
      { id: "1", label: "a" },
      { id: "2", label: "b" },
      { id: "3", label: "c" },
    ];
    const shuffled = shuffleEntries(entries);
    expect(shuffled).toHaveLength(3);
    expect(shuffled.map((e) => e.label).sort()).toEqual(["a", "b", "c"]);
  });

  it("picks multiple entries without duplicates", () => {
    const entries: Entry[] = [
      { id: "1", label: "a" },
      { id: "2", label: "b" },
      { id: "3", label: "c" },
    ];
    const picked = pickMany(entries, 2, false);
    expect(picked).toHaveLength(2);
    const labels = picked.map((e) => e.label);
    expect(new Set(labels).size).toBe(2); // no duplicates
  });

  it("calculates wheel rotation", () => {
    const rotation = calculateWheelRotation(0, 4, 5);
    expect(rotation).toBeGreaterThan(360 * 5);
  });

  it("generates wheel colors", () => {
    const colors = generateWheelColors(5);
    expect(colors).toHaveLength(5);
    colors.forEach((color) => {
      expect(color).toMatch(/^#[A-F0-9]{6}$/i);
    });
  });
});
