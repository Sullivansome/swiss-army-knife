"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatJsonInput, validateJsonInput } from "@/lib/json-formatter";

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

  const handleFormat = () => {
    const result = formatJsonInput(input, labels.error);
    if (result.status === "empty") {
      setOutput("");
      setStatus("");
      setError("");
      return;
    }
    if (result.status === "valid") {
      setOutput(result.formatted ?? "");
      setStatus(labels.valid);
      setError("");
      return;
    }
    setError(result.error ?? labels.error);
    setStatus("");
  };

  const handleValidate = () => {
    const result = validateJsonInput(input, labels.error);
    if (result.status === "empty") {
      setStatus("");
      setError("");
      return;
    }
    if (result.status === "valid") {
      setStatus(labels.valid);
      setError("");
      return;
    }
    setError(result.error ?? labels.error);
    setStatus("");
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
          <label className="text-sm font-medium text-foreground">
            {labels.input}
          </label>
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
          <label className="text-sm font-medium text-foreground">
            {labels.output}
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!output}
          >
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
