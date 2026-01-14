export type TemperatureUnit = "celsius" | "fahrenheit" | "kelvin" | "rankine";

const converters: Record<
  TemperatureUnit,
  {
    toCelsius: (value: number) => number;
    fromCelsius: (value: number) => number;
  }
> = {
  celsius: {
    toCelsius: (value) => value,
    fromCelsius: (value) => value,
  },
  fahrenheit: {
    toCelsius: (value) => ((value - 32) * 5) / 9,
    fromCelsius: (value) => (value * 9) / 5 + 32,
  },
  kelvin: {
    toCelsius: (value) => value - 273.15,
    fromCelsius: (value) => value + 273.15,
  },
  rankine: {
    toCelsius: (value) => ((value - 491.67) * 5) / 9,
    fromCelsius: (value) => ((value + 273.15) * 9) / 5,
  },
};

export function convertTemperature(
  value: number,
  from: TemperatureUnit,
  to: TemperatureUnit,
): number {
  const toCelsius = converters[from]?.toCelsius ?? converters.celsius.toCelsius;
  const fromCelsius =
    converters[to]?.fromCelsius ?? converters.celsius.fromCelsius;
  const celsiusValue = toCelsius(value);
  return fromCelsius(celsiusValue);
}

export function formatTemperature(value: number, fractionDigits = 2): string {
  if (!Number.isFinite(value)) {
    return "—";
  }
  const fixed = Number(value.toFixed(fractionDigits));
  return fixed.toString();
}
