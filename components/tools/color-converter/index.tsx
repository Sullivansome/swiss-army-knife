"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { hexToRgb, rgbToHex } from "@/lib/color";

type Props = {
  labels: {
    hex: string;
    rgb: string;
    copy: string;
    placeholderHex: string;
    placeholderRgb: string;
    invalid: string;
  };
};

export function ColorConverterTool({ labels }: Props) {
  const [hex, setHex] = useState("#3366ff");
  const [rgb, setRgb] = useState("51, 102, 255");
  const [error, setError] = useState("");

  const handleHexChange = (value: string) => {
    setHex(value);
    const parsed = hexToRgb(value);
    if (!parsed) {
      setError(labels.invalid);
      return;
    }
    setError("");
    setRgb(`${parsed.r}, ${parsed.g}, ${parsed.b}`);
  };

  const handleRgbChange = (value: string) => {
    setRgb(value);
    const parts = value.split(",").map((v) => Number(v.trim()));
    const parsed = rgbToHex({ r: parts[0], g: parts[1], b: parts[2] });
    if (!parsed) {
      setError(labels.invalid);
      return;
    }
    setError("");
    setHex(parsed);
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error("copy failed", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          {labels.hex}
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={hex}
            onChange={(event) => handleHexChange(event.target.value)}
            placeholder={labels.placeholderHex}
            className="flex-1 min-w-0 rounded-lg border bg-background px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(hex)}
            disabled={!hex}
          >
            {labels.copy}
          </Button>
        </div>
        <div
          className="h-10 w-full rounded-md border"
          style={{ backgroundColor: error ? "#fff" : hex }}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          {labels.rgb}
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={rgb}
            onChange={(event) => handleRgbChange(event.target.value)}
            placeholder={labels.placeholderRgb}
            className="flex-1 min-w-0 rounded-lg border bg-background px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(rgb)}
            disabled={!rgb}
          >
            {labels.copy}
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {labels.invalid}
        </div>
      ) : null}
    </div>
  );
}

export default ColorConverterTool;
