import { describe, expect, it } from "vitest";

import { convertTemperature } from "@/lib/temperature";

describe("temperature conversions", () => {
  it("converts between celsius and fahrenheit", () => {
    expect(convertTemperature(0, "celsius", "fahrenheit")).toBeCloseTo(32);
    expect(convertTemperature(212, "fahrenheit", "celsius")).toBeCloseTo(100);
  });

  it("handles kelvin and rankine", () => {
    expect(convertTemperature(273.15, "kelvin", "celsius")).toBeCloseTo(0);
    expect(convertTemperature(0, "celsius", "kelvin")).toBeCloseTo(273.15);
    expect(convertTemperature(672, "rankine", "fahrenheit")).toBeCloseTo(
      212.33,
      2,
    );
  });
});
