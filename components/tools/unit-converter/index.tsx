"use client";

import { useMemo, useState } from "react";

import {
  clothingTable,
  convertUnits,
  lengthUnits,
  shoeTable,
  weightUnits,
} from "@/lib/unit-converter";

export type UnitConverterLabels = {
  category: string;
  categories: {
    length: string;
    weight: string;
    shoe: string;
    clothing: string;
  };
  value: string;
  unit: string;
  results: string;
  lengthUnits: Record<string, string>;
  weightUnits: Record<string, string>;
  shoe: {
    title: string;
    eu: string;
    us: string;
    cn: string;
  };
  clothing: {
    title: string;
    international: string;
    us: string;
    eu: string;
    cn: string;
  };
};

type Props = {
  labels: UnitConverterLabels;
};

type Category = "length" | "weight" | "shoe" | "clothing";

export function UnitConverterTool({ labels }: Props) {
  const [category, setCategory] = useState<Category>("length");
  const [value, setValue] = useState(1);
  const [lengthUnit, setLengthUnit] =
    useState<(typeof lengthUnits)[number]["key"]>("cm");
  const [weightUnit, setWeightUnit] =
    useState<(typeof weightUnits)[number]["key"]>("kg");

  const lengthResults = useMemo(
    () => convertUnits(value, lengthUnit, lengthUnits),
    [value, lengthUnit],
  );

  const weightResults = useMemo(
    () => convertUnits(value, weightUnit, weightUnits),
    [value, weightUnit],
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          {labels.category}
        </label>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value as Category)}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
        >
          <option value="length">{labels.categories.length}</option>
          <option value="weight">{labels.categories.weight}</option>
          <option value="shoe">{labels.categories.shoe}</option>
          <option value="clothing">{labels.categories.clothing}</option>
        </select>
      </div>

      {category === "length" ? (
        <ConverterSection
          value={value}
          unit={lengthUnit}
          onValueChange={setValue}
          onUnitChange={(unit) => setLengthUnit(unit as typeof lengthUnit)}
          units={lengthUnits.map((unit) => ({
            key: unit.key,
            label: labels.lengthUnits[unit.key],
          }))}
          results={lengthResults.map((item) => ({
            label: labels.lengthUnits[item.key],
            value: item.value,
          }))}
          labels={{
            value: labels.value,
            unit: labels.unit,
            results: labels.results,
          }}
        />
      ) : null}

      {category === "weight" ? (
        <ConverterSection
          value={value}
          unit={weightUnit}
          onValueChange={setValue}
          onUnitChange={(unit) => setWeightUnit(unit as typeof weightUnit)}
          units={weightUnits.map((unit) => ({
            key: unit.key,
            label: labels.weightUnits[unit.key],
          }))}
          results={weightResults.map((item) => ({
            label: labels.weightUnits[item.key],
            value: item.value,
          }))}
          labels={{
            value: labels.value,
            unit: labels.unit,
            results: labels.results,
          }}
        />
      ) : null}

      {category === "shoe" ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">
            {labels.shoe.title}
          </p>
          <div className="overflow-auto rounded-xl border">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-left">
                  <th className="px-4 py-2 font-medium">{labels.shoe.eu}</th>
                  <th className="px-4 py-2 font-medium">{labels.shoe.us}</th>
                  <th className="px-4 py-2 font-medium">{labels.shoe.cn}</th>
                </tr>
              </thead>
              <tbody>
                {shoeTable.map((row) => (
                  <tr key={row.eu} className="border-t">
                    <td className="px-4 py-2">{row.eu}</td>
                    <td className="px-4 py-2">{row.us}</td>
                    <td className="px-4 py-2">{row.cn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {category === "clothing" ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">
            {labels.clothing.title}
          </p>
          <div className="overflow-auto rounded-xl border">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-left">
                  <th className="px-4 py-2 font-medium">
                    {labels.clothing.international}
                  </th>
                  <th className="px-4 py-2 font-medium">
                    {labels.clothing.us}
                  </th>
                  <th className="px-4 py-2 font-medium">
                    {labels.clothing.eu}
                  </th>
                  <th className="px-4 py-2 font-medium">
                    {labels.clothing.cn}
                  </th>
                </tr>
              </thead>
              <tbody>
                {clothingTable.map((row) => (
                  <tr key={row.intl} className="border-t">
                    <td className="px-4 py-2">{row.intl}</td>
                    <td className="px-4 py-2">{row.us}</td>
                    <td className="px-4 py-2">{row.eu}</td>
                    <td className="px-4 py-2">{row.cn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type ConverterSectionProps = {
  value: number;
  unit: string;
  onValueChange: (value: number) => void;
  onUnitChange: (unit: string) => void;
  units: Array<{ key: string; label: string }>;
  results: Array<{ label: string; value: number }>;
  labels: { value: string; unit: string; results: string };
};

function ConverterSection({
  value,
  unit,
  onValueChange,
  onUnitChange,
  units,
  results,
  labels,
}: ConverterSectionProps) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">
            {labels.value}
          </label>
          <input
            type="number"
            value={value}
            onChange={(event) => onValueChange(Number(event.target.value))}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">
            {labels.unit}
          </label>
          <select
            value={unit}
            onChange={(event) => onUnitChange(event.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          >
            {units.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">
          {labels.results}
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {results.map((row) => (
            <div
              key={row.label}
              className="rounded-xl border bg-card p-3 text-center"
            >
              <p className="text-sm text-muted-foreground">{row.label}</p>
              <p className="mt-2 text-xl font-semibold text-foreground">
                {row.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
