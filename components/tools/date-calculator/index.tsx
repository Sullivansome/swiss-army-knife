"use client";

import { useMemo, useState } from "react";
import { getDateDiffStats } from "@/lib/date-calculator";

export type DateCalculatorLabels = {
  start: string;
  end: string;
  days: string;
  weeks: string;
  months: string;
  future: string;
  past: string;
};

type Props = {
  labels: DateCalculatorLabels;
};

export function DateCalculatorTool({ labels }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);

  const stats = useMemo(() => getDateDiffStats(start, end), [start, end]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">
            {labels.start}
          </label>
          <input
            type="date"
            value={start}
            onChange={(event) => setStart(event.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">
            {labels.end}
          </label>
          <input
            type="date"
            value={end}
            onChange={(event) => setEnd(event.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      {stats ? (
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            {stats.isFuture
              ? labels.future.replace("{days}", String(stats.days))
              : labels.past.replace("{days}", String(stats.days))}
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Stat label={labels.days} value={stats.days} />
            <Stat label={labels.weeks} value={stats.weeks} />
            <Stat label={labels.months} value={stats.months} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

type StatProps = {
  label: string;
  value: number;
};

function Stat({ label, value }: StatProps) {
  return (
    <div className="rounded-xl border bg-background/50 p-4 text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

export default DateCalculatorTool;
