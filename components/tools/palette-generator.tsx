"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export type PaletteLabels = {
  palette: string;
  gradient: string;
  generate: string;
  copy: string;
  copied: string;
};

type Props = {
  labels: PaletteLabels;
};

const initialPalette = () => Array.from({ length: 5 }, () => randomColor());

export function PaletteGeneratorTool({ labels }: Props) {
  const [colors, setColors] = useState<string[]>(initialPalette);
  const [copied, setCopied] = useState<string>("");

  const regenerate = () => {
    setColors(initialPalette());
    setCopied("");
  };

  const copy = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopied(color);
      setTimeout(() => setCopied(""), 1500);
    } catch (error) {
      console.error("copy", error);
    }
  };

  return (
    <div className="space-y-4">
      <Button size="sm" onClick={regenerate}>
        {labels.generate}
      </Button>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground">{labels.palette}</p>
        <div className="grid gap-3 md:grid-cols-5">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => copy(color)}
              className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-sm transition hover:-translate-y-0.5"
              style={{ borderColor: color }}
            >
              <span className="h-16 w-full rounded-lg" style={{ backgroundColor: color }} />
              <span className="font-mono text-sm text-foreground">{color}</span>
              {copied === color ? <span className="text-xs text-muted-foreground">{labels.copied}</span> : null}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">{labels.gradient}</p>
        <div
          className="h-32 w-full rounded-xl border"
          style={{ background: `linear-gradient(135deg, ${colors.join(", ")})` }}
        />
      </div>
    </div>
  );
}

function randomColor() {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0")}`.toUpperCase();
}
