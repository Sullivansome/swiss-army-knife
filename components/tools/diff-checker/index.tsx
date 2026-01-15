"use client";

import { ArrowRightLeft, GitCompare, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { StudioPanel } from "@/components/ui/studio/studio-panel";
import { StudioToolbar } from "@/components/ui/studio/studio-toolbar";
import { ToolStudio } from "@/components/ui/studio/tool-studio";
import { buildDiff, type DiffResult } from "@/lib/text";

type Props = {
  labels: {
    left: string;
    right: string;
    summary: string;
    added: string;
    removed: string;
    button: string;
    noDiff: string;
    placeholderLeft: string;
    placeholderRight: string;
  };
};

export function DiffCheckerTool({ labels }: Props) {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [diff, setDiff] = useState<DiffResult>([]);

  const summary = useMemo(() => {
    const added = diff.filter((item) => item.added).length;
    const removed = diff.filter((item) => item.removed).length;
    return { added, removed };
  }, [diff]);

  const handleCompare = () => {
    setDiff(buildDiff(left, right));
  };

  const handleClear = () => {
    setLeft("");
    setRight("");
    setDiff([]);
  };

  const handleSwap = () => {
    setLeft(right);
    setRight(left);
    setDiff([]);
  };

  return (
    <div className="flex flex-col">
      <StudioToolbar>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleCompare}
            disabled={!left && !right}
          >
            <GitCompare className="mr-2 h-4 w-4" />
            {labels.button}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleSwap}>
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Swap
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </StudioToolbar>

      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <StudioPanel
            title={labels.left}
            actions={<CopyButton value={left} size="icon-sm" variant="ghost" />}
          >
            <textarea
              value={left}
              onChange={(event) => setLeft(event.target.value)}
              placeholder={labels.placeholderLeft}
              className="h-[300px] w-full resize-none rounded-md bg-transparent p-4 font-mono text-sm focus:outline-none"
            />
          </StudioPanel>

          <StudioPanel
            title={labels.right}
            actions={
              <CopyButton value={right} size="icon-sm" variant="ghost" />
            }
          >
            <textarea
              value={right}
              onChange={(event) => setRight(event.target.value)}
              placeholder={labels.placeholderRight}
              className="h-[300px] w-full resize-none rounded-md bg-transparent p-4 font-mono text-sm focus:outline-none"
            />
          </StudioPanel>
        </div>

        {(diff.length > 0 || (left && right)) && (
          <StudioPanel
            title={
              <div className="flex items-center gap-4">
                <span>Result</span>
                {diff.length > 0 && (
                  <div className="flex gap-3 text-xs normal-case">
                    <span className="text-emerald-500 font-medium">
                      +{summary.added} {labels.added}
                    </span>
                    <span className="text-rose-500 font-medium">
                      -{summary.removed} {labels.removed}
                    </span>
                  </div>
                )}
              </div>
            }
            className="min-h-[200px]"
          >
            {diff.length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                {left && right
                  ? "Click Compare to see differences"
                  : labels.noDiff}
              </div>
            ) : (
              <div className="max-h-[500px] overflow-auto rounded-md border bg-muted/20 font-mono text-sm">
                {diff.map((part, index) => (
                  <div
                    key={index}
                    className={`flex px-4 py-1 ${
                      part.added
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : part.removed
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          : "text-foreground"
                    }`}
                  >
                    <span className="mr-4 select-none opacity-50 w-4 text-center">
                      {part.added ? "+" : part.removed ? "-" : " "}
                    </span>
                    <span className="whitespace-pre-wrap break-all">
                      {part.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </StudioPanel>
        )}
      </div>
    </div>
  );
}

export default DiffCheckerTool;
