"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { convertCase, type CaseStyle } from "@/lib/text";

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

const order: CaseStyle[] = ["upper", "lower", "camel", "snake", "kebab", "title"];

export function CaseConverterTool({ labels }: Props) {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");

  const handleConvert = (style: CaseStyle) => {
    setOutput(convertCase(text, style));
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground" htmlFor="case-input">
          {labels.input}
        </label>
        <Button variant="outline" size="sm" onClick={handleReset} disabled={!text && !output}>
          {labels.reset}
        </Button>
      </div>
      <textarea
        id="case-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={labels.placeholder}
        className="min-h-36 w-full rounded-lg border bg-background p-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <div className="flex flex-wrap gap-2">
        {order.map((style) => (
          <Button key={style} variant="outline" size="sm" onClick={() => handleConvert(style)} disabled={!text}>
            {labelMap[style]}
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">{labels.output}</span>
          <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output}>
            {labels.copy}
          </Button>
        </div>
        <textarea
          value={output}
          readOnly
          className="min-h-32 w-full cursor-text rounded-lg border bg-muted/50 p-3 text-sm shadow-inner"
        />
      </div>
    </div>
  );
}
