"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  formatDateTimeLocal,
  getAvailableTimezones,
  getTimeZoneLabel,
  parseDateTimeLocal,
} from "@/lib/timezones";
import { buildTimeline, buildTimelineSummary } from "@/lib/timezone-planner";

type Labels = {
  meetingTime: string;
  baseTimezone: string;
  timezoneHint: string;
  participants: string;
  addTimezone: string;
  removeTimezone: string;
  workingHours: string;
  offHours: string;
  copySummary: string;
  copied: string;
  emptyState: string;
  timelineLabel: string;
};

type Props = {
  labels: Labels;
};

type Row = {
  id: string;
  zone: string;
};

const DEFAULT_CANDIDATES = ["UTC", "Europe/London", "Asia/Shanghai", "America/New_York"];

function uniqueId() {
  return Math.random().toString(36).slice(2, 9);
}

export function TimezonePlanner({ labels }: Props) {
  const timezoneOptions = useMemo(() => getAvailableTimezones(), []);
  const defaultZone = useMemo(() => {
    if (typeof Intl !== "undefined") {
      const current = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (current) return current;
    }
    return "UTC";
  }, []);

  const [baseZone, setBaseZone] = useState(defaultZone);
  const [baseDate, setBaseDate] = useState(() => new Date());
  const [inputValue, setInputValue] = useState(() => formatDateTimeLocal(new Date(), defaultZone));
  const [rows, setRows] = useState<Row[]>(() => {
    const unique = Array.from(new Set(DEFAULT_CANDIDATES.filter((zone) => zone !== defaultZone)));
    return unique.slice(0, 2).map((zone) => ({ id: uniqueId(), zone }));
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setInputValue(formatDateTimeLocal(baseDate, baseZone));
  }, [baseDate, baseZone]);

  const handleTimeChange = (value: string) => {
    setInputValue(value);
    const parsed = parseDateTimeLocal(value, baseZone);
    if (parsed) {
      setBaseDate(parsed);
    }
  };

  const handleBaseZoneChange = (zone: string) => {
    setBaseZone(zone);
  };

  const availableForNewRow = timezoneOptions.find(
    (zone) => zone !== baseZone && !rows.some((row) => row.zone === zone),
  );

  const addRow = () => {
    if (!availableForNewRow) return;
    setRows((current) => [...current, { id: uniqueId(), zone: availableForNewRow }]);
  };

  const updateZone = (id: string, zone: string) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, zone } : row)));
  };

  const removeRow = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
  };

  const locale = typeof navigator !== "undefined" ? navigator.language : "en-US";
  const participantZones = [
    { id: "base", zone: baseZone, isBase: true },
    ...rows.map((row) => ({ ...row, isBase: false })),
  ];

  const timeline = buildTimeline(baseDate, participantZones, locale);
  const summary = buildTimelineSummary(timeline);

  const handleCopy = async () => {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("copy failed", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{labels.meetingTime}</label>
          <input
            type="datetime-local"
            value={inputValue}
            onChange={(event) => handleTimeChange(event.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground">{labels.timezoneHint}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{labels.baseTimezone}</label>
          <select
            value={baseZone}
            onChange={(event) => handleBaseZoneChange(event.target.value)}
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

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">{labels.participants}</h3>
          <Button variant="outline" size="sm" onClick={addRow} disabled={!availableForNewRow}>
            {labels.addTimezone}
          </Button>
        </div>
        <div className="space-y-2">
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">{labels.emptyState}</p>
          ) : null}
          {rows.map((row) => (
            <div key={row.id} className="flex items-center gap-3 rounded-lg border bg-card p-3">
              <select
                value={row.zone}
                onChange={(event) => updateZone(row.id, event.target.value)}
                className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {timezoneOptions.map((zone) => (
                  <option key={zone} value={zone}>
                    {getTimeZoneLabel(zone)}
                  </option>
                ))}
              </select>
              <Button variant="ghost" size="sm" onClick={() => removeRow(row.id)}>
                {labels.removeTimezone}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">{labels.timelineLabel}</h3>
          <Button variant="outline" size="sm" onClick={handleCopy} disabled={!summary}>
            {copied ? labels.copied : labels.copySummary}
          </Button>
        </div>
        {timeline.length === 0 ? (
          <p className="text-sm text-muted-foreground">{labels.emptyState}</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {timeline.map((entry) => (
              <div key={entry.id} className="space-y-2 rounded-xl border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{entry.label}</p>
                    <p className="text-xs text-muted-foreground">{entry.formatted}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      entry.workFriendly ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {entry.workFriendly ? labels.workingHours : labels.offHours}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: "4%",
                      marginLeft: `${(entry.hour / 24) * 96}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
