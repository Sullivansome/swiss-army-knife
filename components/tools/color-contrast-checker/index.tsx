"use client";

import { ArrowRightLeft, CheckCircle2, Copy, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { WidgetCard } from "@/components/ui/widget-card";
import { formatContrastRatio, getContrastRatio } from "@/lib/color-contrast";
import { cn } from "@/lib/utils";

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

export function ColorContrastChecker({ labels }: Props) {
  const [textColor, setTextColor] = useState("#111827");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const ratio = useMemo(
    () => getContrastRatio(textColor, backgroundColor),
    [textColor, backgroundColor],
  );
  const aaNormal = ratio !== null && ratio >= 4.5;
  const aaLarge = ratio !== null && ratio >= 3;
  const aaa = ratio !== null && ratio >= 7;

  const swapColors = () => {
    setTextColor(backgroundColor);
    setBackgroundColor(textColor);
  };

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast.success(`Copied ${color}`);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <WidgetCard title="Colors" className="h-full">
          <div className="space-y-6">
            <ColorInput
              label={labels.textColor}
              value={textColor}
              onChange={setTextColor}
              onCopy={() => copyColor(textColor)}
            />

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={swapColors}
                className="rounded-full"
              >
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                {labels.swap}
              </Button>
            </div>

            <ColorInput
              label={labels.backgroundColor}
              value={backgroundColor}
              onChange={setBackgroundColor}
              onCopy={() => copyColor(backgroundColor)}
            />
          </div>
        </WidgetCard>

        <WidgetCard className="h-full flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {labels.ratioLabel}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl font-bold tracking-tighter tabular-nums">
                {formatContrastRatio(ratio)}
              </span>
              <span className="text-xl text-muted-foreground font-medium">
                :1
              </span>
            </div>
            <div className="flex gap-2 mt-4">
              <StatusBadge label="AA" pass={aaNormal} />
              <StatusBadge label="AA Large" pass={aaLarge} />
              <StatusBadge label="AAA" pass={aaa} />
            </div>
          </div>
        </WidgetCard>
      </div>

      <WidgetCard title={labels.previewLabel}>
        <div className="grid gap-6 md:grid-cols-2">
          <div
            className="rounded-xl border p-8 shadow-sm transition-colors duration-200"
            style={{ backgroundColor, color: textColor }}
          >
            <p className="text-2xl font-bold mb-4">Large Text (24px/bold)</p>
            <p className="text-base opacity-90 leading-relaxed">
              Normal text (16px). The quick brown fox jumps over the lazy dog.
              Ratio: {formatContrastRatio(ratio)}
            </p>
          </div>

          <div
            className="rounded-xl border p-8 shadow-sm transition-colors duration-200"
            style={{ backgroundColor: textColor, color: backgroundColor }}
          >
            <p className="text-2xl font-bold mb-4">Inverted Colors</p>
            <p className="text-base opacity-90 leading-relaxed">
              Normal text (16px). The quick brown fox jumps over the lazy dog.
              Ratio: {formatContrastRatio(ratio)}
            </p>
          </div>
        </div>
      </WidgetCard>
    </div>
  );
}

function StatusBadge({ label, pass }: { label: string; pass: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        pass
          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
          : "bg-destructive/10 text-destructive border-destructive/20",
      )}
    >
      {pass ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : (
        <XCircle className="h-3.5 w-3.5" />
      )}
      {label}
    </span>
  );
}

function ColorInput({
  label,
  value,
  onChange,
  onCopy,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onCopy: () => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex gap-3">
        <div className="relative h-12 w-16 overflow-hidden rounded-lg border shadow-sm">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -top-1/2 -left-1/2 h-[200%] w-[200%] cursor-pointer p-0 border-0"
          />
        </div>
        <div className="flex-1 relative">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-12 w-full rounded-lg border bg-background px-4 font-mono text-base uppercase focus:outline-none focus:ring-2 focus:ring-primary/20"
            maxLength={7}
          />
          <button
            onClick={onCopy}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ColorContrastChecker;
