"use client";

import { FileText, RefreshCw, Type } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { StudioPanel } from "@/components/ui/studio/studio-panel";
import { StudioToolbar } from "@/components/ui/studio/studio-toolbar";
import { ToolStudio } from "@/components/ui/studio/tool-studio";
import { generateLoremIpsum } from "@/lib/lorem-ipsum";

type Props = {
  labels: {
    paragraphs: string;
    words: string;
    generate: string;
    copy: string;
    placeholder: string;
  };
};

export function LoremIpsumTool({ labels }: Props) {
  const [paragraphs, setParagraphs] = useState(3);
  const [words, setWords] = useState(20);
  const [output, setOutput] = useState("");

  const handleGenerate = () => {
    setOutput(generateLoremIpsum(paragraphs, words));
  };

  return (
    <div className="flex flex-col">
      <StudioToolbar>
        <div className="flex items-center gap-4">
          <NumberField
            label={labels.paragraphs}
            value={paragraphs}
            min={1}
            max={20}
            onChange={setParagraphs}
            icon={<FileText className="h-4 w-4" />}
          />
          <div className="w-px h-6 bg-border" />
          <NumberField
            label={labels.words}
            value={words}
            min={4}
            max={120}
            onChange={setWords}
            icon={<Type className="h-4 w-4" />}
          />
        </div>

        <div className="flex-1" />

        <Button variant="default" size="sm" onClick={handleGenerate}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {labels.generate}
        </Button>
      </StudioToolbar>

      <StudioPanel
        title="Generated Text"
        actions={<CopyButton value={output} label={labels.copy} />}
      >
        <textarea
          value={output}
          readOnly
          placeholder={labels.placeholder}
          className="h-[400px] w-full resize-none rounded-md bg-transparent p-4 text-sm leading-relaxed focus:outline-none text-muted-foreground"
        />
      </StudioPanel>
    </div>
  );
}

type NumberFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  icon?: React.ReactNode;
};

function NumberField({
  label,
  value,
  min,
  max,
  onChange,
  icon,
}: NumberFieldProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {icon}
        {label}
      </div>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-16 rounded-md border bg-background px-2 py-1 text-sm text-center font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

export default LoremIpsumTool;
