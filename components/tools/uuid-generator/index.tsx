"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { generateUuids } from "@/lib/uuid";

type Labels = {
  count: string;
  countHelper: string;
  generate: string;
  copy: string;
  error: string;
  placeholder: string;
};

type Props = {
  labels: Labels;
};

const MAX_COUNT = 20;

export function UuidGeneratorTool({ labels }: Props) {
  const [count, setCount] = useState(1);
  const [error, setError] = useState("");
  const [values, setValues] = useState<string[]>([]);

  const output = useMemo(() => values.join("\n"), [values]);

  const handleGenerate = () => {
    if (!Number.isFinite(count) || count < 1 || count > MAX_COUNT) {
      setError(labels.error);
      return;
    }

    setError("");
    setValues(generateUuids(count));
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
    } catch (err) {
      console.error("copy failed", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor="uuid-count"
          >
            {labels.count}
          </label>
          <input
            id="uuid-count"
            type="number"
            min={1}
            max={MAX_COUNT}
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground">{labels.countHelper}</p>
        </div>
        <div className="flex gap-2 md:justify-end">
          <Button variant="default" onClick={handleGenerate}>
            {labels.generate}
          </Button>
          <Button variant="outline" onClick={handleCopy} disabled={!output}>
            {labels.copy}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">UUID</label>
        <textarea
          value={output}
          readOnly
          placeholder={labels.placeholder}
          className="min-h-40 w-full cursor-text rounded-lg border bg-muted/50 p-3 text-sm font-mono shadow-inner"
        />
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}
    </div>
  );
}

export default UuidGeneratorTool;
