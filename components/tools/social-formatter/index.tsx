"use client";

import { ArrowRight, List, Smile, Text } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { StudioPanel } from "@/components/ui/studio/studio-panel";
import { StudioToolbar } from "@/components/ui/studio/studio-toolbar";
import { ToolStudio } from "@/components/ui/studio/tool-studio";
import { formatSocialText } from "@/lib/social-formatter";

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
    setOutput(
      formatSocialText(input, {
        emoji,
        useBullets,
        insertSpacing,
      }),
    );
  };

  return (
    <div className="flex flex-col">
      <StudioToolbar className="h-auto flex-wrap gap-4 py-3">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <label className="inline-flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
            <input
              type="checkbox"
              checked={insertSpacing}
              onChange={(event) => setInsertSpacing(event.target.checked)}
              className="rounded border-muted-foreground/40 text-primary focus:ring-primary"
            />
            <Text className="h-4 w-4" />
            {labels.spacing}
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
            <input
              type="checkbox"
              checked={useBullets}
              onChange={(event) => setUseBullets(event.target.checked)}
              className="rounded border-muted-foreground/40 text-primary focus:ring-primary"
            />
            <List className="h-4 w-4" />
            {labels.bullets}
          </label>
          <div className="flex items-center gap-2">
            <Smile className="h-4 w-4" />
            <span className="whitespace-nowrap">{labels.emoji}</span>
            <input
              value={emoji}
              onChange={(event) => setEmoji(event.target.value)}
              placeholder={labels.emojiPlaceholder}
              className="w-12 rounded-md border bg-background px-2 py-1 text-center text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="flex-1" />

        <Button variant="default" size="sm" onClick={format}>
          {labels.format}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </StudioToolbar>

      <ToolStudio layout="split">
        <StudioPanel
          title={labels.input}
          actions={<CopyButton value={input} size="icon-sm" variant="ghost" />}
        >
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={labels.placeholder}
            className="h-[400px] w-full resize-none rounded-md bg-transparent p-4 text-sm focus:outline-none"
          />
        </StudioPanel>

        <StudioPanel
          title={labels.output}
          actions={<CopyButton value={output} label={labels.copy} />}
        >
          <textarea
            value={output}
            readOnly
            className="h-[400px] w-full resize-none rounded-md bg-transparent p-4 text-sm focus:outline-none text-muted-foreground"
          />
        </StudioPanel>
      </ToolStudio>
    </div>
  );
}

export default SocialFormatterTool;
