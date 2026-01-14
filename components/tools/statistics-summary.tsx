"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { computeSummaryStats, parseNumberList } from "@/lib/statistics";

type Labels = {
  inputLabel: string;
  placeholder: string;
  invalidCount: string;
  metrics: {
    count: string;
    sum: string;
    mean: string;
    median: string;
    min: string;
    max: string;
    variance: string;
    stddev: string;
  };
  empty: string;
  chartLabel: string;
  copySummary: string;
  copied: string;
};

type Props = {
  labels: Labels;
};

function formatNumber(value: number) {
  return Number.isFinite(value)
    ? value.toLocaleString(undefined, { maximumFractionDigits: 4 })
    : "–";
}

export function StatisticsSummaryTool({ labels }: Props) {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const parsed = useMemo(() => parseNumberList(input), [input]);
  const stats = useMemo(
    () => computeSummaryStats(parsed.values),
    [parsed.values],
  );

  const sparklinePoints = useMemo(() => {
    if (parsed.values.length === 0) return "";
    const min = Math.min(...parsed.values);
    const max = Math.max(...parsed.values);
    const range = max - min || 1;
    const denominator = Math.max(parsed.values.length - 1, 1);
    return parsed.values
      .map((value, index) => {
        const x = (index / denominator) * 100;
        const y = 100 - ((value - min) / range) * 100;
        return `${x},${y}`;
      })
      .join(" ");
  }, [parsed.values]);

  const summaryText = stats
    ? `${labels.metrics.count}: ${stats.count}\n${labels.metrics.sum}: ${stats.sum}\n${labels.metrics.mean}: ${stats.mean}\n${labels.metrics.median}: ${stats.median}`
    : "";

  const handleCopy = async () => {
    if (!summaryText) return;
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("copy summary failed", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          {labels.inputLabel}
        </label>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={labels.placeholder}
          className="min-h-32 w-full rounded-lg border bg-background p-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {parsed.invalid > 0 ? (
          <p className="text-xs text-muted-foreground">
            {labels.invalidCount.replace("{count}", String(parsed.invalid))}
          </p>
        ) : null}
      </div>

      {stats ? (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            {[
              { label: labels.metrics.count, value: stats.count },
              { label: labels.metrics.sum, value: stats.sum },
              { label: labels.metrics.mean, value: stats.mean },
              { label: labels.metrics.median, value: stats.median },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border bg-card p-3 text-sm shadow-sm"
              >
                <p className="text-xs font-semibold text-muted-foreground">
                  {item.label}
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {formatNumber(item.value)}
                </p>
              </div>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {[
              { label: labels.metrics.min, value: stats.min },
              { label: labels.metrics.max, value: stats.max },
              { label: labels.metrics.variance, value: stats.variance },
              { label: labels.metrics.stddev, value: stats.stddev },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border bg-card p-3 text-sm shadow-sm"
              >
                <p className="text-xs font-semibold text-muted-foreground">
                  {item.label}
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {formatNumber(item.value)}
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                {labels.chartLabel}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!summaryText}
              >
                {copied ? labels.copied : labels.copySummary}
              </Button>
            </div>
            <div className="rounded-xl border bg-card/40 p-4">
              {sparklinePoints ? (
                <svg viewBox="0 0 100 100" className="h-24 w-full">
                  <polyline
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    points={sparklinePoints}
                  />
                </svg>
              ) : (
                <p className="text-sm text-muted-foreground">{labels.empty}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground">
          {labels.empty}
        </p>
      )}
    </div>
  );
}
