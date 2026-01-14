"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <NumberField
          label={labels.paragraphs}
          value={paragraphs}
          min={1}
          max={20}
          onChange={setParagraphs}
        />
        <NumberField label={labels.words} value={words} min={4} max={120} onChange={setWords} />
        <div className="md:col-span-2 flex items-end justify-end gap-2">
          <Button variant="default" onClick={handleGenerate}>
            {labels.generate}
          </Button>
          <Button variant="outline" onClick={handleCopy} disabled={!output}>
            {labels.copy}
          </Button>
        </div>
      </div>

      <textarea
        value={output}
        readOnly
        placeholder={labels.placeholder}
        className="min-h-40 w-full cursor-text rounded-lg border bg-muted/50 p-3 text-sm shadow-inner"
      />
    </div>
  );
}

type NumberFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

function NumberField({ label, value, min, max, onChange }: NumberFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground" htmlFor={label}>
        {label}
      </label>
      <input
        id={label}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
