"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { toChineseUppercase } from "@/lib/finance";

export type FinanceNumberCaseLabels = {
  amountLabel: string;
  placeholder: string;
  convert: string;
  copy: string;
  copied: string;
  resultLabel: string;
  invalid: string;
};

export function FinanceNumberCaseTool({
  labels,
}: {
  labels: FinanceNumberCaseLabels;
}) {
  const [amount, setAmount] = useState("1000.50");
  const [result, setResult] = useState(() => toChineseUppercase(1000.5));
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function handleConvert() {
    try {
      const value = Number(amount);
      if (Number.isNaN(value) || Math.abs(value) > 999999999999.99) {
        setError(labels.invalid);
        return;
      }
      const converted = toChineseUppercase(value);
      setResult(converted);
      setError("");
      setCopied(false);
    } catch {
      setError(labels.invalid);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label
          className="text-sm font-medium text-foreground"
          htmlFor="finance-amount"
        >
          {labels.amountLabel}
        </label>
        <input
          id="finance-amount"
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder={labels.placeholder}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={handleConvert}>
          {labels.convert}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleCopy}
          disabled={!result}
        >
          {copied ? labels.copied : labels.copy}
        </Button>
      </div>
      {error ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <div className="rounded-2xl border bg-card px-5 py-6 shadow-sm">
        <p className="text-sm font-semibold text-foreground">
          {labels.resultLabel}
        </p>
        <p className="mt-2 text-xl font-medium text-foreground">{result}</p>
      </div>
    </div>
  );
}
