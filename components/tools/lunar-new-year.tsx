"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { getDaysUntil, getNextLunarNewYearDate, pickGreeting } from "@/lib/lunar-new-year";

export type LunarNewYearLabels = {
  countdownTitle: string;
  countdown: string;
  today: string;
  nextDateLabel: string;
  greetingTitle: string;
  drawGreeting: string;
  greetings: string[];
};

export function LunarNewYearTool({ labels }: { labels: LunarNewYearLabels }) {
  const [greeting, setGreeting] = useState(labels.greetings[0] ?? "新年快乐！");

  const nextDate = useMemo(() => getNextLunarNewYearDate(new Date()), []);

  const daysUntil = useMemo(() => getDaysUntil(new Date(), nextDate), [nextDate]);

  function handlePickGreeting() {
    setGreeting(pickGreeting(labels.greetings));
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card px-5 py-6 shadow-sm">
        <p className="text-sm font-semibold text-foreground">{labels.countdownTitle}</p>
        <p className="text-3xl font-bold text-foreground">
          {daysUntil === 0 ? labels.today : labels.countdown.replace("{count}", daysUntil.toString())}
        </p>
        <p className="text-sm text-muted-foreground">
          {labels.nextDateLabel}: {nextDate.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="rounded-2xl border bg-card px-5 py-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-foreground">{labels.greetingTitle}</p>
          <Button type="button" onClick={handlePickGreeting} variant="outline">
            {labels.drawGreeting}
          </Button>
        </div>
        <p className="mt-4 text-lg font-medium text-foreground">{greeting}</p>
      </div>
    </div>
  );
}
