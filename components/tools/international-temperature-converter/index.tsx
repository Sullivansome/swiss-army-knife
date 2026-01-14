"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { convertTemperature, type TemperatureUnit } from "@/lib/temperature";

export type TemperatureConverterLabels = {
  valueLabel: string;
  fromLabel: string;
  toLabel: string;
  swapLabel: string;
  resetLabel: string;
  invalid: string;
  allConversions: string;
};

export type TemperatureConverterProps = {
  labels: TemperatureConverterLabels;
  units: { value: TemperatureUnit; label: string }[];
};

export function TemperatureConverterTool({
  labels,
  units,
}: TemperatureConverterProps) {
  const [input, setInput] = useState("0");
  const [fromUnit, setFromUnit] = useState<TemperatureUnit>(
    units[0]?.value ?? "celsius",
  );
  const [toUnit, setToUnit] = useState<TemperatureUnit>(
    units[1]?.value ?? units[0]?.value ?? "fahrenheit",
  );

  const parsedValue = Number(input);
  const hasError = Number.isNaN(parsedValue);

  const result = useMemo(() => {
    if (hasError) {
      return null;
    }
    const list = units.map((unit) => {
      const converted = convertTemperature(parsedValue, fromUnit, unit.value);
      return {
        unit: unit.value,
        label: unit.label,
        value: Number(converted.toFixed(2)),
      };
    });
    const selected = convertTemperature(parsedValue, fromUnit, toUnit);
    return {
      converted: Number(selected.toFixed(2)),
      list,
    };
  }, [parsedValue, fromUnit, toUnit, units, hasError]);

  function swapUnits() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }

  function reset() {
    setInput("0");
    setFromUnit(units[0]?.value ?? "celsius");
    setToUnit(units[1]?.value ?? units[0]?.value ?? "fahrenheit");
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor="temperature-value"
          >
            {labels.valueLabel}
          </label>
          <input
            id="temperature-value"
            type="number"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor="from-unit"
          >
            {labels.fromLabel}
          </label>
          <select
            id="from-unit"
            value={fromUnit}
            onChange={(event) =>
              setFromUnit(event.target.value as TemperatureUnit)
            }
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          >
            {units.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor="to-unit"
          >
            {labels.toLabel}
          </label>
          <select
            id="to-unit"
            value={toUnit}
            onChange={(event) =>
              setToUnit(event.target.value as TemperatureUnit)
            }
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          >
            {units.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <Button type="button" onClick={swapUnits} className="flex-1">
            {labels.swapLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={reset}
            className="flex-1"
          >
            {labels.resetLabel}
          </Button>
        </div>
      </div>

      {hasError ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {labels.invalid}
        </p>
      ) : null}

      {result ? (
        <div className="space-y-3">
          <div className="rounded-xl border bg-card px-4 py-3">
            <p className="text-sm text-muted-foreground">
              {labels.allConversions}
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {result.list.map((entry) => (
                <div
                  key={entry.unit}
                  className="rounded-lg border bg-background px-3 py-2 text-sm"
                >
                  <p className="font-semibold text-foreground">{entry.label}</p>
                  <p className="text-lg font-mono text-foreground">
                    {entry.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border bg-foreground px-4 py-3 text-background">
            <p className="text-sm text-background/80">
              {fromUnit.toUpperCase()} → {toUnit.toUpperCase()}
            </p>
            <p className="text-2xl font-semibold">{result.converted}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
