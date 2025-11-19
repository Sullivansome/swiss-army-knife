"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type Labels = {
  input: string;
  output: string;
  format: string;
  validate: string;
  clear: string;
  copy: string;
  placeholder: string;
  error: string;
  valid: string;
};

type Props = {
  labels: Labels;
};

export function JsonFormatterTool({ labels }: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const formatError = (message: string) => {
    const positionMatch = message.match(/position\s+(\d+)/i);

    if (!positionMatch) {
      return labels.error;
    }

    const pos = Number(positionMatch[1]);
    if (!Number.isFinite(pos) || pos < 0) {
      return labels.error;
    }

    const snippet = input.slice(0, pos);
    const lines = snippet.split(/\r\n|\r|\n/);
    const line = lines.length;
    const column = lines[lines.length - 1]?.length ?? 0;

    return `${labels.error} (line ${line}, column ${column + 1})`;
  };

  const handleFormat = () => {
    if (!input.trim()) {
      setOutput("");
      setStatus("");
      setError("");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setStatus(labels.valid);
      setError("");
    } catch (err) {
      console.error("format failed", err);
      setError(formatError(err instanceof Error ? err.message : String(err)));
      setStatus("");
    }
  };

  const handleValidate = () => {
    if (!input.trim()) {
      setStatus("");
      setError("");
      return;
    }

    try {
      JSON.parse(input);
      setStatus(labels.valid);
      setError("");
    } catch (err) {
      console.error("validate failed", err);
      setError(formatError(err instanceof Error ? err.message : String(err)));
      setStatus("");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setStatus("");
    setError("");
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setStatus(labels.valid);
    } catch (err) {
      console.error("copy failed", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-sm font-medium text-foreground">{labels.input}</label>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleClear}>
              {labels.clear}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleValidate}>
              {labels.validate}
            </Button>
            <Button variant="default" size="sm" onClick={handleFormat}>
              {labels.format}
            </Button>
          </div>
        </div>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={labels.placeholder}
          className="min-h-48 w-full rounded-lg border bg-background p-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">{labels.output}</label>
          <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output}>
            {labels.copy}
          </Button>
        </div>
        <textarea
          value={output}
          readOnly
          placeholder={labels.placeholder}
          className="min-h-48 w-full cursor-text rounded-lg border bg-muted/50 p-3 text-sm font-mono shadow-inner"
        />
      </div>

      {status ? (
        <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-200">
          {status}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}
    </div>
  );
}
