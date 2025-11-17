"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { getTextStats } from "@/lib/text";

type Props = {
  labels: {
    input: string;
    characters: string;
    words: string;
    lines: string;
    reset: string;
    placeholder: string;
  };
};

export function WordCounterTool({ labels }: Props) {
  const [text, setText] = useState("");
  const stats = useMemo(() => getTextStats(text), [text]);

  const handleReset = () => setText("");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground" htmlFor="word-counter-input">
          {labels.input}
        </label>
        <Button variant="outline" size="sm" onClick={handleReset} disabled={!text}>
          {labels.reset}
        </Button>
      </div>
      <textarea
        id="word-counter-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={labels.placeholder}
        className="min-h-40 w-full rounded-lg border bg-background p-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <div className="grid grid-cols-3 gap-3 text-sm">
        <StatCard label={labels.characters} value={stats.characters} />
        <StatCard label={labels.words} value={stats.words} />
        <StatCard label={labels.lines} value={stats.lines} />
      </div>
    </div>
  );
}

type StatProps = {
  label: string;
  value: number;
};

function StatCard({ label, value }: StatProps) {
  return (
    <div className="rounded-lg border bg-muted/40 px-3 py-2 text-center shadow-inner">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold text-foreground">{value}</div>
    </div>
  );
}
