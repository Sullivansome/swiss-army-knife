"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

export type RandomPickerLabels = {
  input: string;
  placeholder: string;
  mode: string;
  drawMode: string;
  groupMode: string;
  winnersLabel: string;
  groupSizeLabel: string;
  run: string;
  winnersTitle: string;
  groupsTitle: string;
  groupLabel: string;
  copy: string;
  clear: string;
  error: string;
};

type Mode = "draw" | "group";

type Props = {
  labels: RandomPickerLabels;
};

export function RandomPickerTool({ labels }: Props) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("draw");
  const [winnerCount, setWinnerCount] = useState(1);
  const [groupSize, setGroupSize] = useState(3);
  const [winners, setWinners] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[][]>([]);
  const [status, setStatus] = useState<string>("");

  const entries = useMemo(
    () =>
      input
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean),
    [input],
  );

  const shuffle = (array: string[]) => {
    const next = [...array];
    for (let i = next.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    return next;
  };

  const run = () => {
    if (!entries.length) {
      setStatus(labels.error);
      return;
    }
    const randomized = shuffle(entries);
    if (mode === "draw") {
      const count = Math.min(Math.max(1, winnerCount), randomized.length);
      setWinners(randomized.slice(0, count));
      setGroups([]);
    } else {
      const size = Math.max(2, groupSize);
      const buckets: string[][] = [];
      for (let i = 0; i < randomized.length; i += size) {
        buckets.push(randomized.slice(i, i + size));
      }
      setGroups(buckets);
      setWinners([]);
    }
    setStatus("");
  };

  const copyResult = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("copy", error);
    }
  };

  const clear = () => {
    setInput("");
    setWinners([]);
    setGroups([]);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{labels.input}</label>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={labels.placeholder}
          className="min-h-48 w-full rounded-lg border bg-background p-3 text-sm shadow-inner"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{labels.mode}</label>
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value as Mode)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          >
            <option value="draw">{labels.drawMode}</option>
            <option value="group">{labels.groupMode}</option>
          </select>
        </div>
        {mode === "draw" ? (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{labels.winnersLabel}</label>
            <input
              type="number"
              min={1}
              value={winnerCount}
              onChange={(event) => setWinnerCount(Number(event.target.value))}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{labels.groupSizeLabel}</label>
            <input
              type="number"
              min={2}
              value={groupSize}
              onChange={(event) => setGroupSize(Number(event.target.value))}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={clear}>
          {labels.clear}
        </Button>
        <Button size="sm" onClick={run}>
          {labels.run}
        </Button>
      </div>

      {status ? <p className="text-sm text-destructive">{status}</p> : null}

      {winners.length ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{labels.winnersTitle}</p>
            <Button variant="outline" size="sm" onClick={() => copyResult(winners.join("\n"))}>
              {labels.copy}
            </Button>
          </div>
          <ul className="list-decimal space-y-1 rounded-lg border bg-muted/30 p-3 pl-6 text-sm">
            {winners.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {groups.length ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{labels.groupsTitle}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyResult(groups.map((group, index) => `#${index + 1}: ${group.join(", ")}`).join("\n"))}
            >
              {labels.copy}
            </Button>
          </div>
          <div className="space-y-2">
            {groups.map((group, index) => (
              <div key={index} className="rounded-lg border bg-muted/30 p-3 text-sm">
                <p className="font-semibold">{labels.groupLabel.replace("{index}", String(index + 1))}</p>
                <p>{group.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
