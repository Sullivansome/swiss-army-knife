"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { analyzeRegexMatches } from "@/lib/regex-playground";
import { cn } from "@/lib/utils";

const FLAG_ORDER = ["g", "i", "m", "s", "u", "y"] as const;

type FlagKey = (typeof FLAG_ORDER)[number];

type Labels = {
  patternLabel: string;
  patternPlaceholder: string;
  flagsLabel: string;
  flagsHint: string;
  sampleLabel: string;
  samplePlaceholder: string;
  matchesLabel: string;
  noMatches: string;
  helper: string;
  error: string;
  clear: string;
  indexLabel: string;
  groupLabel: string;
  highlightLabel: string;
  flagDescriptions: Record<FlagKey, string>;
};

type Props = {
  labels: Labels;
};

export function RegexPlaygroundTool({ labels }: Props) {
  const [pattern, setPattern] = useState("");
  const [sample, setSample] = useState("");
  const [selectedFlags, setSelectedFlags] = useState<FlagKey[]>(["g"]);

  const flagString = FLAG_ORDER.filter((flag) =>
    selectedFlags.includes(flag),
  ).join("");

  const { matches, segments, hasError } = useMemo(
    () => analyzeRegexMatches(pattern, flagString, sample),
    [pattern, sample, flagString],
  );

  const toggleFlag = (flag: FlagKey) => {
    setSelectedFlags((current) =>
      current.includes(flag)
        ? current.filter((value) => value !== flag)
        : [...current, flag],
    );
  };

  const clearAll = () => {
    setPattern("");
    setSample("");
    setSelectedFlags(["g"]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span>{labels.helper}</span>
        <Button variant="ghost" size="sm" onClick={clearAll}>
          {labels.clear}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {labels.patternLabel}
          </label>
          <input
            value={pattern}
            onChange={(event) => setPattern(event.target.value)}
            placeholder={labels.patternPlaceholder}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm font-mono shadow-inner focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {labels.flagsLabel}
          </label>
          <div className="flex flex-wrap gap-2">
            {FLAG_ORDER.map((flag) => (
              <button
                key={flag}
                type="button"
                onClick={() => toggleFlag(flag)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold transition",
                  selectedFlags.includes(flag)
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-muted text-muted-foreground hover:border-foreground/40",
                )}
              >
                {flag.toUpperCase()}{" "}
                <span className="text-[11px] font-normal">
                  {labels.flagDescriptions[flag]}
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{labels.flagsHint}</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          {labels.sampleLabel}
        </label>
        <textarea
          value={sample}
          onChange={(event) => setSample(event.target.value)}
          placeholder={labels.samplePlaceholder}
          className="min-h-40 w-full rounded-lg border bg-background p-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            {labels.highlightLabel}
          </span>
          {hasError ? (
            <span className="text-xs text-destructive">{labels.error}</span>
          ) : null}
        </div>
        <div className="min-h-20 rounded-lg border bg-muted/40 p-3 font-mono text-sm leading-relaxed">
          {segments.map((segment, index) => (
            <span
              key={`${segment.text}-${index}`}
              className={
                segment.match
                  ? "rounded bg-amber-200 px-0.5 text-foreground"
                  : undefined
              }
            >
              {segment.text || (segment.match ? "\u00a0" : "\u200b")}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            {labels.matchesLabel}
          </span>
          <span className="text-xs text-muted-foreground">
            {matches.length}
          </span>
        </div>
        {matches.length === 0 ? (
          <p className="rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground">
            {labels.noMatches}
          </p>
        ) : (
          <div className="space-y-3">
            {matches.map((match, idx) => (
              <div
                key={`${match.index}-${idx}`}
                className="rounded-lg border bg-card p-3 shadow-sm"
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {labels.indexLabel} {match.index}
                  </span>
                  <span>#{idx + 1}</span>
                </div>
                <pre className="mt-2 whitespace-pre-wrap font-mono text-sm text-foreground">
                  {match.text}
                </pre>
                {match.groups.length ? (
                  <div className="mt-3 space-y-1">
                    {match.groups.map((group, groupIndex) => (
                      <div
                        key={groupIndex}
                        className="text-xs text-muted-foreground"
                      >
                        {labels.groupLabel} {groupIndex + 1}:{" "}
                        <span className="font-mono text-foreground">
                          {group ?? ""}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}
                {match.named && Object.keys(match.named).length ? (
                  <div className="mt-2 space-y-1">
                    {Object.entries(match.named).map(([key, value]) => (
                      <div key={key} className="text-xs text-muted-foreground">
                        {labels.groupLabel} {key}:{" "}
                        <span className="font-mono text-foreground">
                          {value ?? ""}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
