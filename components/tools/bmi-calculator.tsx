"use client";

import { useMemo, useState } from "react";

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

  const bmi = useMemo(() => {
    if (!height || !weight) return 0;
    const meters = height / 100;
    return weight / (meters * meters);
  }, [height, weight]);

  const category = useMemo(() => {
    if (!bmi) return labels.tips.normal;
    if (bmi < 18.5) return labels.tips.underweight;
    if (bmi < 25) return labels.tips.normal;
    if (bmi < 30) return labels.tips.overweight;
    return labels.tips.obese;
  }, [bmi, labels.tips]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={labels.height} value={height} onChange={setHeight} />
        <Field label={labels.weight} value={weight} onChange={setWeight} />
      </div>

      <div className="rounded-2xl border bg-card p-4 text-center">
        <p className="text-sm text-muted-foreground">{labels.result}</p>
        <p className="mt-3 text-4xl font-semibold text-foreground">{bmi ? bmi.toFixed(1) : "—"}</p>
        <p className="mt-2 text-sm text-muted-foreground">{labels.category}</p>
        <p className="mt-1 text-base font-medium text-foreground">{category}</p>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

function Field({ label, value, onChange }: FieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
      />
    </div>
  );
}
