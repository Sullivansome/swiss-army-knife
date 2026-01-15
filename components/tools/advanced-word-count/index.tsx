"use client";

import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { StudioPanel } from "@/components/ui/studio/studio-panel";
import { StudioToolbar } from "@/components/ui/studio/studio-toolbar";
import { ToolStudio } from "@/components/ui/studio/tool-studio";
import { WidgetStat } from "@/components/ui/widget-card";
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
    <div className="flex flex-col">
      <StudioToolbar>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setText("")}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </StudioToolbar>

      <ToolStudio layout="split">
        <StudioPanel
          title={labels.input}
          actions={<CopyButton value={text} size="icon-sm" variant="ghost" />}
        >
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={labels.placeholder}
            className="h-[500px] w-full resize-none rounded-md bg-transparent p-4 text-sm leading-relaxed focus:outline-none"
          />
        </StudioPanel>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1">
            Statistics
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <WidgetStat
              label={labels.words}
              value={stats.words}
              className="bg-card"
            />
            <WidgetStat
              label={labels.sentences}
              value={stats.sentences}
              className="bg-card"
            />
            <WidgetStat
              label={labels.charsWithSpaces}
              value={stats.charsWithSpaces}
              className="bg-card"
            />
            <WidgetStat
              label={labels.charsWithoutSpaces}
              value={stats.charsWithoutSpaces}
              className="bg-card"
            />
            <WidgetStat
              label={labels.paragraphs}
              value={stats.paragraphs}
              className="bg-card sm:col-span-2"
            />
          </div>
        </div>
      </ToolStudio>
    </div>
  );
}

export default AdvancedWordCountTool;
