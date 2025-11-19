"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export type SocialFormatterLabels = {
  input: string;
  placeholder: string;
  spacing: string;
  bullets: string;
  emoji: string;
  emojiPlaceholder: string;
  format: string;
  output: string;
  copy: string;
};

type Props = {
  labels: SocialFormatterLabels;
};

export function SocialFormatterTool({ labels }: Props) {
  const [input, setInput] = useState("");
  const [insertSpacing, setInsertSpacing] = useState(true);
  const [useBullets, setUseBullets] = useState(true);
  const [emoji, setEmoji] = useState("✨");
  const [output, setOutput] = useState("");

  const format = () => {
    const lines = input
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        let next = line;
        if (emoji.trim()) {
          next = `${emoji.trim()} ${next}`;
        }
        if (useBullets) {
          next = `• ${next}`;
        }
        return next;
      });
    const joiner = insertSpacing ? "\n\n" : "\n";
    setOutput(lines.join(joiner));
  };

  const copy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
    } catch (error) {
      console.error("copy", error);
    }
  };

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

      <div className="grid gap-4 md:grid-cols-3">
        <label className="inline-flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={insertSpacing} onChange={(event) => setInsertSpacing(event.target.checked)} />
          {labels.spacing}
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={useBullets} onChange={(event) => setUseBullets(event.target.checked)} />
          {labels.bullets}
        </label>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">{labels.emoji}</label>
          <input
            value={emoji}
            onChange={(event) => setEmoji(event.target.value)}
            placeholder={labels.emojiPlaceholder}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={copy} disabled={!output}>
          {labels.copy}
        </Button>
        <Button size="sm" onClick={format}>
          {labels.format}
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{labels.output}</label>
        <textarea value={output} readOnly className="min-h-40 w-full rounded-lg border bg-muted/50 p-3 text-sm shadow-inner" />
      </div>
    </div>
  );
}
