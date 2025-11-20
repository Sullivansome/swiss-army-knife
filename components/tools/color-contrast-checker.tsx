"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

type Labels = {
  textColor: string;
  backgroundColor: string;
  swap: string;
  ratioLabel: string;
  aaNormal: string;
  aaLarge: string;
  aaa: string;
  pass: string;
  fail: string;
  previewLabel: string;
  helper: string;
};

type Props = {
  labels: Labels;
};

type RGB = { r: number; g: number; b: number };

function parseHex(color: string): RGB | null {
  const normalized = color.trim().replace("#", "");
  if (![3, 6].includes(normalized.length)) return null;
  const full = normalized.length === 3 ? normalized.split("").map((char) => char + char).join("") : normalized;
  const value = Number.parseInt(full, 16);
  if (Number.isNaN(value)) return null;
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function luminance({ r, g, b }: RGB) {
  const channel = (component: number) => {
    const value = component / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function getContrastRatio(foreground: string, background: string) {
  const fg = parseHex(foreground);
  const bg = parseHex(background);
  if (!fg || !bg) return null;
  const lum1 = luminance(fg) + 0.05;
  const lum2 = luminance(bg) + 0.05;
  const ratio = lum1 > lum2 ? lum1 / lum2 : lum2 / lum1;
  return Number.isFinite(ratio) ? ratio : null;
}

function formatRatio(value: number | null) {
  if (!value) return "–";
  return `${value.toFixed(2)}:1`;
}

export function ColorContrastChecker({ labels }: Props) {
  const [textColor, setTextColor] = useState("#111827");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const ratio = useMemo(() => getContrastRatio(textColor, backgroundColor), [textColor, backgroundColor]);
  const aaNormal = ratio !== null && ratio >= 4.5;
  const aaLarge = ratio !== null && ratio >= 3;
  const aaa = ratio !== null && ratio >= 7;

  const swapColors = () => {
    setTextColor(backgroundColor);
    setBackgroundColor(textColor);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {([
          { label: labels.textColor, value: textColor, onChange: setTextColor },
          { label: labels.backgroundColor, value: backgroundColor, onChange: setBackgroundColor },
        ] as const).map((field) => (
          <div key={field.label} className="space-y-2">
              <label className="text-sm font-medium text-foreground">{field.label}</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={field.value}
                  onChange={(event) => field.onChange(event.target.value)}
                  className="h-10 w-14 cursor-pointer rounded border bg-transparent"
                />
                <input
                  value={field.value}
                  onChange={(event) => field.onChange(event.target.value)}
                  className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">{labels.ratioLabel}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">{formatRatio(ratio)}</p>
        </div>
        <Button variant="outline" size="sm" onClick={swapColors}>
          {labels.swap}
        </Button>
        <p className="text-xs text-muted-foreground">{labels.helper}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {[
          { label: labels.aaNormal, pass: aaNormal },
          { label: labels.aaLarge, pass: aaLarge },
          { label: labels.aaa, pass: aaa },
        ].map((item) => (
          <div key={item.label} className="space-y-1 rounded-lg border bg-card p-3 text-sm">
            <p className="font-semibold text-foreground">{item.label}</p>
            <p className={`text-sm font-medium ${item.pass ? "text-emerald-600" : "text-amber-600"}`}>
              {item.pass ? labels.pass : labels.fail}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{labels.previewLabel}</label>
        <div
          className="rounded-xl border p-6 shadow-sm"
          style={{ backgroundColor, color: textColor }}
        >
          <p className="text-lg font-semibold">{labels.previewLabel}</p>
          <p className="mt-2 text-sm opacity-80">
            The quick brown fox jumps over the lazy dog. 1234567890 — Aa Bb Cc.
          </p>
        </div>
      </div>
    </div>
  );
}
