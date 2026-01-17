"use client";

import { List, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { WidgetCard } from "@/components/ui/widget-card";
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

const MAX_COUNT = 50;

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

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <WidgetCard>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex-1 space-y-2">
            <label
              htmlFor="uuid-count"
              className="text-sm font-medium text-foreground"
            >
              {labels.count}
            </label>
            <input
              id="uuid-count"
              type="number"
              min={1}
              max={MAX_COUNT}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full rounded-lg border bg-background px-4 py-2.5 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="text-xs text-muted-foreground">
              {labels.countHelper}
            </p>
          </div>

          <Button
            size="lg"
            onClick={handleGenerate}
            className="w-full md:w-auto"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {labels.generate}
          </Button>
        </div>
      </WidgetCard>

      {values.length > 0 && (
        <WidgetCard className="bg-muted/30">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <List className="h-4 w-4" />
              {values.length} UUIDs Generated
            </div>
            <CopyButton value={output} label={labels.copy} />
          </div>

          <div className="relative rounded-lg border bg-card p-4 font-mono text-sm shadow-sm">
            <pre className="whitespace-pre-wrap break-all">{output}</pre>
          </div>
        </WidgetCard>
      )}

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}
    </div>
  );
}

export default UuidGeneratorTool;
