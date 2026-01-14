export const lengthUnits = [
  { key: "cm", factor: 1 },
  { key: "m", factor: 100 },
  { key: "inch", factor: 2.54 },
  { key: "foot", factor: 30.48 },
] as const;

export const weightUnits = [
  { key: "kg", factor: 1 },
  { key: "g", factor: 0.001 },
  { key: "lb", factor: 0.453592 },
] as const;

export const shoeTable = [
  { eu: 36, us: 5.5, cn: 36 },
  { eu: 37, us: 6.5, cn: 37 },
  { eu: 38, us: 7.5, cn: 38 },
  { eu: 39, us: 8.5, cn: 39 },
  { eu: 40, us: 9, cn: 40 },
  { eu: 41, us: 9.5, cn: 41 },
  { eu: 42, us: 10, cn: 42 },
  { eu: 43, us: 11, cn: 43 },
  { eu: 44, us: 12, cn: 44 },
] as const;

export const clothingTable = [
  { intl: "XS", us: "0-2", eu: "32-34", cn: "155/80A" },
  { intl: "S", us: "4-6", eu: "34-36", cn: "160/84A" },
  { intl: "M", us: "8-10", eu: "38-40", cn: "165/88A" },
  { intl: "L", us: "12-14", eu: "42-44", cn: "170/92A" },
  { intl: "XL", us: "16-18", eu: "46-48", cn: "175/96A" },
] as const;

export function convertUnits<
  T extends readonly { key: string; factor: number }[],
>(value: number, unitKey: T[number]["key"], units: T) {
  const base = value * units.find((unit) => unit.key === unitKey)!.factor;
  return units.map((unit) => ({
    key: unit.key,
    value: +(base / unit.factor).toFixed(2),
  }));
}
