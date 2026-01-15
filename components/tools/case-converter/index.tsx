"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { StudioPanel } from "@/components/ui/studio/studio-panel";
import { StudioToolbar } from "@/components/ui/studio/studio-toolbar";
import { ToolStudio } from "@/components/ui/studio/tool-studio";
import { type CaseStyle, convertCase } from "@/lib/text";

type Props = {
  labels: {
    input: string;
    output: string;
    upper: string;
    lower: string;
    camel: string;
    snake: string;
    kebab: string;
    title: string;
    copy: string;
    reset: string;
    placeholder: string;
  };
};

const order: CaseStyle[] = [
  "upper",
  "lower",
  "camel",
  "snake",
  "kebab",
  "title",
];

export function CaseConverterTool({ labels }: Props) {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");

  const handleConvert = (style: CaseStyle) => {
    setOutput(convertCase(text, style));
  };

  const handleReset = () => {
    setText("");
    setOutput("");
  };

  const labelMap: Record<CaseStyle, string> = {
    upper: labels.upper,
    lower: labels.lower,
    camel: labels.camel,
    snake: labels.snake,
    kebab: labels.kebab,
    title: labels.title,
  };

  return (
    <div className="flex flex-col">
      <StudioToolbar className="flex-wrap h-auto py-3">
        <div className="flex flex-wrap gap-2 flex-1">
          {order.map((style) => (
            <Button
              key={style}
              variant="secondary"
              size="sm"
              onClick={() => handleConvert(style)}
              disabled={!text}
            >
              {labelMap[style]}
            </Button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-destructive hover:text-destructive shrink-0"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {labels.reset}
        </Button>
      </StudioToolbar>

      <ToolStudio layout="split">
        <StudioPanel
          title={labels.input}
          actions={<CopyButton value={text} size="icon-sm" variant="ghost" />}
        >
          <textarea
            id="case-input"
            value={text}
            onChange={(event) => setText(event.target.value)}
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

export default CaseConverterTool;
