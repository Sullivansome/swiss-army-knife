"use client";

import { Binary, Calculator } from "lucide-react";
import { useMemo, useState } from "react";
import { WidgetCard } from "@/components/ui/widget-card";
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
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <WidgetCard title="Input" className="h-full">
          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="base-select"
                className="text-sm font-medium text-foreground"
              >
                {labels.baseLabel}
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {OPTIONS.map((opt) => (
                  <button
                    key={opt.base}
                    onClick={() => setInputBase(opt.base)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      inputBase === opt.base
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {labels.bases[opt.key]} ({opt.base})
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="base-value"
                className="text-sm font-medium text-foreground"
              >
                {labels.inputLabel}
              </label>
              <textarea
                id="base-value"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                className="h-32 w-full resize-none rounded-xl border bg-background p-4 text-lg font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter value..."
              />
            </div>

            {conversion.error && (
              <p className="text-sm font-medium text-destructive animate-in fade-in slide-in-from-top-2">
                {conversion.error}
              </p>
            )}
          </div>
        </WidgetCard>

        <WidgetCard title={labels.resultsLabel} className="h-full bg-muted/30">
          <div className="grid gap-4">
            {conversion.outputs.map((entry) => (
              <div
                key={entry.base}
                className={`relative overflow-hidden rounded-xl border bg-card p-4 shadow-sm transition-all ${
                  entry.base === inputBase
                    ? "ring-2 ring-primary/20 border-primary/50"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {labels.bases[entry.key]}{" "}
                    <span className="opacity-50">Base {entry.base}</span>
                  </span>
                  {entry.base === inputBase && (
                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      SOURCE
                    </span>
                  )}
                </div>
                <p className="font-mono text-xl font-medium tracking-tight break-all">
                  {entry.display}
                </p>
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}

export default BaseConverterTool;
