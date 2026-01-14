"use client";

import { useMemo, useState } from "react";

import { computeAdvancedWordStats } from "@/lib/advanced-word-count";
export type AdvancedWordCountLabels = {
  input: string;
  placeholder: string;
  charsWithSpaces: string;
  charsWithoutSpaces: string;
  words: string;
  sentences: string;
  paragraphs: string;
};

type Props = {
  labels: AdvancedWordCountLabels;
};

export function AdvancedWordCountTool({ labels }: Props) {
  const [text, setText] = useState("");

  const stats = useMemo(() => computeAdvancedWordStats(text), [text]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          {labels.input}
        </label>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={labels.placeholder}
          className="min-h-48 w-full rounded-lg border bg-background p-3 text-sm shadow-inner"
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Stat label={labels.charsWithSpaces} value={stats.charsWithSpaces} />
        <Stat
          label={labels.charsWithoutSpaces}
          value={stats.charsWithoutSpaces}
        />
        <Stat label={labels.words} value={stats.words} />
        <Stat label={labels.sentences} value={stats.sentences} />
        <Stat label={labels.paragraphs} value={stats.paragraphs} />
      </div>
    </div>
  );
}

type StatProps = {
  label: string;
  value: number;
};

function Stat({ label, value }: StatProps) {
  return (
    <div className="rounded-xl border bg-card p-4 text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

export default AdvancedWordCountTool;
