"use client";

import { ArrowRight, Calendar as CalendarIcon, Clock } from "lucide-react";
import { useMemo, useState } from "react";
import { WidgetCard, WidgetStat } from "@/components/ui/widget-card";
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
    <div className="space-y-8">
      <WidgetCard title="Select Dates">
        <div className="flex flex-col gap-6 md:flex-row md:items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              {labels.start}
            </label>
            <input
              type="date"
              value={start}
              onChange={(event) => setStart(event.target.value)}
              className="w-full rounded-lg border bg-background px-4 py-2.5 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center justify-center pb-3 text-muted-foreground">
            <ArrowRight className="h-6 w-6 rotate-90 md:rotate-0" />
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              {labels.end}
            </label>
            <input
              type="date"
              value={end}
              onChange={(event) => setEnd(event.target.value)}
              className="w-full rounded-lg border bg-background px-4 py-2.5 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </WidgetCard>

      {stats && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 text-center">
            <p className="text-lg font-medium text-primary">
              {stats.isFuture
                ? labels.future.replace("{days}", String(stats.days))
                : labels.past.replace("{days}", String(stats.days))}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <WidgetStat
              label={labels.days}
              value={stats.days}
              icon={<Clock className="h-4 w-4 text-blue-500" />}
              className="bg-card"
            />
            <WidgetStat
              label={labels.weeks}
              value={stats.weeks}
              icon={<CalendarIcon className="h-4 w-4 text-emerald-500" />}
              className="bg-card"
            />
            <WidgetStat
              label={labels.months}
              value={stats.months}
              icon={<CalendarIcon className="h-4 w-4 text-purple-500" />}
              className="bg-card"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DateCalculatorTool;
