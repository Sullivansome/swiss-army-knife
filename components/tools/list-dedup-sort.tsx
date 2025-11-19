"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

export type ListToolLabels = {
  input: string;
  placeholder: string;
  result: string;
  sortLabel: string;
  sortAsc: string;
  sortDesc: string;
  original: string;
  caseSensitive: string;
  copy: string;
  clear: string;
};

type SortMode = "none" | "asc" | "desc";

type Props = {
  labels: ListToolLabels;
};

export function ListDedupSortTool({ labels }: Props) {
  const [input, setInput] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("none");

  const processed = useMemo(() => {
    const lines = input
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    const seen = new Set<string>();
    const result: string[] = [];
    for (const line of lines) {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(line);
      }
    }
    if (sortMode === "asc") {
      result.sort((a, b) => a.localeCompare(b));
    } else if (sortMode === "desc") {
      result.sort((a, b) => b.localeCompare(a));
    }
    return result.join("\n");
  }, [input, caseSensitive, sortMode]);

  const handleCopy = async () => {
    if (!processed) return;
    try {
      await navigator.clipboard.writeText(processed);
    } catch (error) {
      console.error("copy error", error);
    }
  };

  const setSort = (mode: SortMode) => setSortMode(mode);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{labels.input}</label>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={labels.placeholder}
          className="min-h-48 w-full rounded-lg border bg-background p-3 text-sm shadow-inner"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={caseSensitive} onChange={(event) => setCaseSensitive(event.target.checked)} />
          {labels.caseSensitive}
        </label>
        <div className="inline-flex flex-wrap items-center gap-2">
          <span>{labels.sortLabel}</span>
          <Button variant={sortMode === "none" ? "default" : "outline"} size="sm" onClick={() => setSort("none")}>
            {labels.original}
          </Button>
          <Button variant={sortMode === "asc" ? "default" : "outline"} size="sm" onClick={() => setSort("asc")}>
            {labels.sortAsc}
          </Button>
          <Button variant={sortMode === "desc" ? "default" : "outline"} size="sm" onClick={() => setSort("desc")}>
            {labels.sortDesc}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">{labels.result}</label>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setInput("")}>
              {labels.clear}
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy} disabled={!processed}>
              {labels.copy}
            </Button>
          </div>
        </div>
        <textarea
          value={processed}
          readOnly
          className="min-h-40 w-full rounded-lg border bg-muted/50 p-3 text-sm shadow-inner"
        />
      </div>
    </div>
  );
}
