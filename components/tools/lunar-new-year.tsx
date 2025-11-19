"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

const UPCOMING_NEW_YEAR_DATES = [
  "2025-01-29",
  "2026-02-17",
  "2027-02-06",
  "2028-01-26",
  "2029-02-13",
];

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

  const nextDate = useMemo(() => {
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    for (const iso of UPCOMING_NEW_YEAR_DATES) {
      const candidate = new Date(iso + "T00:00:00");
      if (candidate >= todayMidnight) {
        return candidate;
      }
    }
    const fallback = UPCOMING_NEW_YEAR_DATES.at(-1);
    return fallback ? new Date(fallback + "T00:00:00") : todayMidnight;
  }, []);

  const daysUntil = useMemo(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const end = new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate());
    const diffMs = end.getTime() - start.getTime();
    return Math.max(0, Math.round(diffMs / 86400000));
  }, [nextDate]);

  function pickGreeting() {
    const pool = labels.greetings.length > 0 ? labels.greetings : ["新年快乐！"];
    const random = pool[Math.floor(Math.random() * pool.length)] ?? pool[0];
    setGreeting(random);
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
          <Button type="button" onClick={pickGreeting} variant="outline">
            {labels.drawGreeting}
          </Button>
        </div>
        <p className="mt-4 text-lg font-medium text-foreground">{greeting}</p>
      </div>
    </div>
  );
}
