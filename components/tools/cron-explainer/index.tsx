"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  type CronField,
  type CronSegment,
  getNextRuns,
  parseCronExpression,
} from "@/lib/cron";
import {
  formatInTimeZone,
  getAvailableTimezones,
  getTimeZoneLabel,
} from "@/lib/timezones";

type Labels = {
  expressionLabel: string;
  placeholder: string;
  helper: string;
  timezoneLabel: string;
  parseError: string;
  fields: {
    minute: string;
    hour: string;
    dayOfMonth: string;
    month: string;
    dayOfWeek: string;
  };
  unitNames: {
    minute: string;
    hour: string;
    dayOfMonth: string;
    month: string;
    dayOfWeek: string;
  };
  months: Record<string, string>;
  weekdays: Record<string, string>;
  descriptions: {
    any: string;
    value: string;
    list: string;
    range: string;
    rangeStep: string;
    separator: string;
  };
  nextRuns: string;
  copySchedule: string;
  copied: string;
};

type Props = {
  labels: Labels;
};

const FIELD_ORDER: Array<keyof Labels["fields"]> = [
  "minute",
  "hour",
  "dayOfMonth",
  "month",
  "dayOfWeek",
];

function formatValue(
  value: number,
  field: keyof Labels["fields"],
  labels: Labels,
) {
  if (field === "month") {
    return labels.months[String(value)] ?? String(value);
  }
  if (field === "dayOfWeek") {
    return labels.weekdays[String(value)] ?? String(value);
  }
  return String(value);
}

function describeField(
  field: CronField,
  key: keyof Labels["fields"],
  labels: Labels,
) {
  const unit = labels.unitNames[key];
  if (field.any) {
    return labels.descriptions.any.replace("{unit}", unit);
  }
  const segments = field.segments.map((segment) =>
    describeSegment(segment, key, labels),
  );
  return labels.descriptions.list.replace(
    "{items}",
    segments.filter(Boolean).join(labels.descriptions.separator),
  );
}

function describeSegment(
  segment: CronSegment,
  key: keyof Labels["fields"],
  labels: Labels,
) {
  const unit = labels.unitNames[key];
  if (segment.type === "value") {
    return labels.descriptions.value.replace(
      "{value}",
      formatValue(segment.value, key, labels),
    );
  }
  if (segment.type === "range") {
    const start = formatValue(segment.start, key, labels);
    const end = formatValue(segment.end, key, labels);
    if (segment.step && segment.step > 1) {
      return labels.descriptions.rangeStep
        .replace("{start}", start)
        .replace("{end}", end)
        .replace("{step}", String(segment.step))
        .replace("{unit}", unit);
    }
    return labels.descriptions.range
      .replace("{start}", start)
      .replace("{end}", end);
  }
  return "";
}

export function CronExplainerTool({ labels }: Props) {
  const timezoneOptions = useMemo(() => getAvailableTimezones(), []);
  const defaultZone = useMemo(() => {
    if (typeof Intl !== "undefined") {
      const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (zone) return zone;
    }
    return "UTC";
  }, []);

  const [expression, setExpression] = useState("0 9 * * 1-5");
  const [timezone, setTimezone] = useState(defaultZone);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    try {
      const schedule = parseCronExpression(expression);
      const nextRuns = getNextRuns(schedule, { count: 5, timeZone: timezone });
      return { schedule, runs: nextRuns, error: null as string | null };
    } catch (error) {
      return {
        schedule: null,
        runs: [],
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }, [expression, timezone]);

  const summary = result.runs
    .map(
      (run) =>
        `${getTimeZoneLabel(timezone)}: ${formatInTimeZone(run, timezone)}`,
    )
    .join("\n");

  const handleCopy = async () => {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("copy schedule failed", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {labels.expressionLabel}
          </label>
          <input
            value={expression}
            onChange={(event) => setExpression(event.target.value)}
            placeholder={labels.placeholder}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground">{labels.helper}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {labels.timezoneLabel}
          </label>
          <select
            value={timezone}
            onChange={(event) => setTimezone(event.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {timezoneOptions.map((zone) => (
              <option key={zone} value={zone}>
                {getTimeZoneLabel(zone)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {result.error ? (
        <div className="rounded-md border border-destructive/60 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {labels.parseError}: {result.error}
        </div>
      ) : null}

      {result.schedule ? (
        <div className="grid gap-3 rounded-xl border bg-card p-4 shadow-sm md:grid-cols-2">
          {FIELD_ORDER.map((fieldKey) => (
            <div
              key={fieldKey}
              className="space-y-1 rounded-lg border bg-background/50 p-3"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {labels.fields[fieldKey]}
              </p>
              <p className="text-sm text-foreground">
                {describeField(result.schedule![fieldKey], fieldKey, labels)}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            {labels.nextRuns}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!summary}
          >
            {copied ? labels.copied : labels.copySchedule}
          </Button>
        </div>
        {result.runs.length === 0 ? (
          <p className="text-sm text-muted-foreground">{labels.parseError}</p>
        ) : (
          <ol className="space-y-2 text-sm text-foreground">
            {result.runs.map((run, index) => (
              <li
                key={run.toISOString()}
                className="rounded-lg border bg-card/60 px-3 py-2"
              >
                <span className="font-semibold">#{index + 1}</span>{" "}
                {formatInTimeZone(run, timezone)}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
