"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { buildDiff, type DiffResult } from "@/lib/text";

type Props = {
  labels: {
    left: string;
    right: string;
    summary: string;
    added: string;
    removed: string;
    button: string;
    noDiff: string;
    placeholderLeft: string;
    placeholderRight: string;
  };
};

export function DiffCheckerTool({ labels }: Props) {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [diff, setDiff] = useState<DiffResult>([]);

  const summary = useMemo(() => {
    const added = diff.filter((item) => item.added).length;
    const removed = diff.filter((item) => item.removed).length;
    return { added, removed };
  }, [diff]);

  const handleCompare = () => {
    setDiff(buildDiff(left, right));
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <TextPanel
          label={labels.left}
          value={left}
          placeholder={labels.placeholderLeft}
          onChange={(value) => setLeft(value)}
        />
        <TextPanel
          label={labels.right}
          value={right}
          placeholder={labels.placeholderRight}
          onChange={(value) => setRight(value)}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border bg-muted/50 px-3 py-2 text-sm">
        <div className="flex flex-wrap gap-3 text-muted-foreground">
          <span className="font-medium text-foreground">{labels.summary}</span>
          <span>
            {labels.added}: {summary.added}
          </span>
          <span>
            {labels.removed}: {summary.removed}
          </span>
        </div>
        <Button variant="default" size="sm" onClick={handleCompare} disabled={!left && !right}>
          {labels.button}
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border">
        {diff.length === 0 ? (
          <div className="px-4 py-3 text-sm text-muted-foreground">{labels.noDiff}</div>
        ) : (
          <div className="max-h-[500px] overflow-auto text-sm font-mono">
            {diff.map((part, index) => (
              <DiffLine key={index} value={part.value} added={part.added} removed={part.removed} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type TextPanelProps = {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

function TextPanel({ label, value, placeholder, onChange }: TextPanelProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-40 w-full rounded-lg border bg-background p-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

type DiffLineProps = {
  value: string;
  added?: boolean;
  removed?: boolean;
};

function DiffLine({ value, added, removed }: DiffLineProps) {
  const bg = added ? "bg-emerald-50 text-emerald-900" : removed ? "bg-rose-50 text-rose-900" : "bg-card";
  const prefix = added ? "+ " : removed ? "- " : "  ";
  return (
    <pre className={`whitespace-pre-wrap px-4 py-2 ${bg}`}>{`${prefix}${value}`}</pre>
  );
}
