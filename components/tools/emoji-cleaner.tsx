"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

export type EmojiCleanerLabels = {
  input: string;
  placeholder: string;
  cleaned: string;
  emojis: string;
  copyClean: string;
  copyEmoji: string;
};

type Props = {
  labels: EmojiCleanerLabels;
};

const emojiRegex = /\p{Extended_Pictographic}|\p{Emoji_Presentation}/gu;

export function EmojiCleanerTool({ labels }: Props) {
  const [input, setInput] = useState("");

  const emojis = useMemo(() => input.match(emojiRegex) ?? [], [input]);
  const cleanText = useMemo(() => input.replace(emojiRegex, ""), [input]);

  const copy = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("copy", error);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{labels.input}</label>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={labels.placeholder}
          className="min-h-48 w-full rounded-lg border bg-background p-3 text-sm shadow-inner"
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{labels.cleaned}</p>
            <Button variant="outline" size="sm" onClick={() => copy(cleanText)} disabled={!cleanText}>
              {labels.copyClean}
            </Button>
          </div>
          <textarea value={cleanText} readOnly className="min-h-24 w-full rounded-lg border bg-muted/50 p-3 text-sm shadow-inner" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{labels.emojis}</p>
            <Button variant="outline" size="sm" onClick={() => copy(emojis.join(""))} disabled={!emojis.length}>
              {labels.copyEmoji}
            </Button>
          </div>
          <div className="min-h-24 rounded-lg border bg-muted/30 p-3 text-2xl">
            {emojis.length ? emojis.join(" ") : <span className="text-sm text-muted-foreground">—</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
