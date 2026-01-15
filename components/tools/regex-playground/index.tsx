"use client";

import { AlertCircle, CheckCircle2, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { StudioPanel } from "@/components/ui/studio/studio-panel";
import { StudioToolbar } from "@/components/ui/studio/studio-toolbar";
import { ToolStudio } from "@/components/ui/studio/tool-studio";
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
    <div className="flex flex-col">
      <StudioToolbar>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {labels.clear}
        </Button>
      </StudioToolbar>

      <ToolStudio layout="vertical">
        <div className="grid gap-6 lg:grid-cols-[1fr_200px]">
          <StudioPanel title={labels.patternLabel} className="h-full">
            <input
              value={pattern}
              onChange={(event) => setPattern(event.target.value)}
              placeholder={labels.patternPlaceholder}
              className="w-full rounded-md bg-transparent p-2 font-mono text-lg font-medium focus:outline-none"
            />
          </StudioPanel>

          <StudioPanel title={labels.flagsLabel} className="h-full">
            <div className="flex flex-wrap gap-2">
              {FLAG_ORDER.map((flag) => (
                <button
                  key={flag}
                  type="button"
                  onClick={() => toggleFlag(flag)}
                  title={labels.flagDescriptions[flag]}
                  className={cn(
                    "rounded px-2 py-1 text-xs font-mono font-medium transition-colors border",
                    selectedFlags.includes(flag)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted",
                  )}
                >
                  {flag}
                </button>
              ))}
            </div>
          </StudioPanel>
        </div>

        <StudioPanel title={labels.sampleLabel}>
          <textarea
            value={sample}
            onChange={(event) => setSample(event.target.value)}
            placeholder={labels.samplePlaceholder}
            className="h-[150px] w-full resize-none rounded-md bg-transparent p-4 text-sm focus:outline-none"
          />
        </StudioPanel>

        <StudioPanel
          title={
            <div className="flex items-center gap-4">
              <span>{labels.highlightLabel}</span>
              {hasError ? (
                <span className="flex items-center gap-1 text-xs text-destructive normal-case">
                  <AlertCircle className="h-3 w-3" />
                  {labels.error}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-muted-foreground normal-case">
                  <CheckCircle2 className="h-3 w-3" />
                  {matches.length} {labels.matchesLabel}
                </span>
              )}
            </div>
          }
          className={hasError ? "border-destructive/50" : ""}
        >
          <div className="min-h-[100px] whitespace-pre-wrap rounded-md bg-muted/20 p-4 font-mono text-sm leading-relaxed">
            {segments.map((segment, index) => (
              <span
                key={`${segment.text}-${index}`}
                className={
                  segment.match
                    ? "rounded bg-amber-200 px-0.5 text-amber-950 dark:bg-amber-500/30 dark:text-amber-100"
                    : undefined
                }
              >
                {segment.text || (segment.match ? "\u00a0" : "\u200b")}
              </span>
            ))}
          </div>
        </StudioPanel>

        {matches.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1">
              Detailed Matches
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {matches.map((match, idx) => (
                <div
                  key={`${match.index}-${idx}`}
                  className="rounded-lg border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span className="font-mono">Index {match.index}</span>
                    <span className="font-medium bg-muted px-1.5 py-0.5 rounded">
                      #{idx + 1}
                    </span>
                  </div>
                  <div className="mb-3 rounded bg-muted/30 p-2 font-mono text-sm break-all">
                    {match.text}
                  </div>

                  {(match.groups.length > 0 ||
                    (match.named && Object.keys(match.named).length > 0)) && (
                    <div className="space-y-2 border-t pt-2">
                      {match.groups.map((group, groupIndex) => (
                        <div
                          key={groupIndex}
                          className="flex justify-between text-xs"
                        >
                          <span className="text-muted-foreground">
                            Group {groupIndex + 1}
                          </span>
                          <span className="font-mono">{group}</span>
                        </div>
                      ))}
                      {match.named &&
                        Object.entries(match.named).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between text-xs"
                          >
                            <span className="text-muted-foreground">{key}</span>
                            <span className="font-mono">{value}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </ToolStudio>
    </div>
  );
}

export default RegexPlaygroundTool;
