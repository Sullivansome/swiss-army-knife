"use client";

import { Activity, Ruler, User, Weight } from "lucide-react";
import { useMemo, useState } from "react";
import { WidgetCard, WidgetStat } from "@/components/ui/widget-card";
import { calculateBmi } from "@/lib/bmi";
import { cn } from "@/lib/utils";

export type BmiLabels = {
  height: string;
  weight: string;
  result: string;
  category: string;
  tips: {
    underweight: string;
    normal: string;
    overweight: string;
    obese: string;
  };
};

type Props = {
  labels: BmiLabels;
};

export function BmiCalculatorTool({ labels }: Props) {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);

  const { bmi, category } = useMemo(
    () => calculateBmi(height, weight),
    [height, weight],
  );
  const categoryLabel = labels.tips[category];

  const getCategoryColor = (cat: typeof category) => {
    switch (cat) {
      case "underweight":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "normal":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "overweight":
        return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "obese":
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-muted-foreground bg-muted border-muted";
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
        <WidgetCard title="Parameters" className="h-full">
          <div className="space-y-6">
            <Field
              label={labels.height}
              value={height}
              onChange={setHeight}
              min={50}
              max={300}
              unit="cm"
              icon={<Ruler className="h-4 w-4" />}
            />
            <Field
              label={labels.weight}
              value={weight}
              onChange={setWeight}
              min={20}
              max={500}
              unit="kg"
              icon={<Weight className="h-4 w-4" />}
            />
          </div>
        </WidgetCard>

        <WidgetCard className="h-full flex flex-col items-center justify-center p-8 bg-muted/10">
          <div className="w-full max-w-sm text-center space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {labels.result}
              </p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-6xl font-bold tracking-tighter tabular-nums">
                  {bmi ? bmi.toFixed(1) : "—"}
                </span>
                <span className="text-xl text-muted-foreground font-medium">
                  BMI
                </span>
              </div>
            </div>

            <div
              className={cn(
                "py-3 px-6 rounded-full border text-lg font-semibold inline-block",
                getCategoryColor(category),
              )}
            >
              {categoryLabel}
            </div>

            <div className="w-full h-4 bg-muted/30 rounded-full overflow-hidden flex mt-8">
              <div
                className="h-full bg-blue-400 w-[18.5%]"
                title="Underweight"
              />
              <div className="h-full bg-emerald-400 w-[25%]" title="Normal" />
              <div
                className="h-full bg-orange-400 w-[15%]"
                title="Overweight"
              />
              <div className="h-full bg-rose-400 flex-1" title="Obese" />
            </div>

            {bmi > 0 && (
              <div
                className="w-0.5 h-6 bg-foreground mx-auto relative -mt-5 transition-all duration-500 ease-out"
                style={{
                  left: `${Math.min(Math.max((bmi / 40) * 100 - 50, -50), 50)}%`,
                }}
              >
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rounded-full" />
              </div>
            )}
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  unit?: string;
  icon?: React.ReactNode;
};

function Field({ label, value, onChange, min, max, unit, icon }: FieldProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          {icon}
          {label}
        </label>
        <span className="text-sm font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
          {value} {unit}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
      />

      <div className="grid grid-cols-[1fr_auto_1fr] gap-2">
        <button
          className="h-8 w-8 rounded-full border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
          onClick={() => onChange(Math.max(min || 0, value - 1))}
        >
          -
        </button>
        <input
          type="number"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-20 text-center rounded-md border bg-background px-2 py-1 text-lg font-bold"
        />
        <button
          className="h-8 w-8 rounded-full border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
          onClick={() => onChange(Math.min(max || 1000, value + 1))}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default BmiCalculatorTool;
