"use client";

import { useMemo, useState } from "react";

import { convertBase, convertToDecimal } from "@/lib/base";

export type BaseConverterLabels = {
  inputLabel: string;
  baseLabel: string;
  resultsLabel: string;
  invalid: string;
  bases: {
    binary: string;
    octal: string;
    decimal: string;
    hex: string;
  };
};

const OPTIONS = [
  { base: 2, key: "binary" as const },
  { base: 8, key: "octal" as const },
  { base: 10, key: "decimal" as const },
  { base: 16, key: "hex" as const },
];

export function BaseConverterTool({ labels }: { labels: BaseConverterLabels }) {
  const [value, setValue] = useState("1010");
  const [inputBase, setInputBase] = useState(2);

  const conversion = useMemo(() => {
    if (!value.trim()) {
      return {
        error: "",
        outputs: OPTIONS.map((option) => ({ ...option, display: "0" })),
      };
    }
    try {
      const outputs = OPTIONS.map((option) => ({
        ...option,
        display:
          option.base === inputBase
            ? value.trim()
            : convertBase(value.trim(), inputBase, option.base).toUpperCase(),
      }));
      return { error: "", outputs };
    } catch {
      return { error: labels.invalid, outputs: [] };
    }
  }, [value, inputBase, labels.invalid]);

  const decimalValue = useMemo(() => {
    try {
      return convertToDecimal(value.trim() || "0", inputBase).toString();
    } catch {
      return "";
    }
  }, [value, inputBase]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor="base-value"
          >
            {labels.inputLabel}
          </label>
          <input
            id="base-value"
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm font-mono"
          />
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor="base-select"
          >
            {labels.baseLabel}
          </label>
          <select
            id="base-select"
            value={inputBase}
            onChange={(event) => setInputBase(Number(event.target.value))}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          >
            <option value={2}>{labels.bases.binary}</option>
            <option value={8}>{labels.bases.octal}</option>
            <option value={10}>{labels.bases.decimal}</option>
            <option value={16}>{labels.bases.hex}</option>
          </select>
        </div>
      </div>

      {conversion.error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm text-destructive">
          {conversion.error}
        </p>
      ) : null}

      <div className="rounded-2xl border bg-card px-5 py-6 shadow-sm">
        <p className="text-sm font-semibold text-foreground">
          {labels.resultsLabel}
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {conversion.outputs.map((entry) => (
            <div
              key={entry.base}
              className="rounded-xl border bg-background px-4 py-3"
            >
              <p className="text-xs font-medium text-muted-foreground">
                {labels.bases[entry.key]}
              </p>
              <p className="mt-1 font-mono text-lg text-foreground">
                {entry.display}
              </p>
            </div>
          ))}
        </div>
        {decimalValue ? (
          <p className="mt-3 text-xs text-muted-foreground">
            {labels.bases.decimal}: {decimalValue}
          </p>
        ) : null}
      </div>
    </div>
  );
}
