"use client";

import { Braces, CheckCircle2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { StudioPanel } from "@/components/ui/studio/studio-panel";
import { StudioToolbar } from "@/components/ui/studio/studio-toolbar";
import { ToolStudio } from "@/components/ui/studio/tool-studio";
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

  return (
    <div className="flex flex-col">
      <StudioToolbar>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleFormat}>
            <Braces className="mr-2 h-4 w-4" />
            {labels.format}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleValidate}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {labels.validate}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {labels.clear}
          </Button>
        </div>
      </StudioToolbar>

      <ToolStudio>
        <StudioPanel
          title={labels.input}
          actions={<CopyButton value={input} size="icon-sm" variant="ghost" />}
        >
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={labels.placeholder}
            className="h-[400px] w-full resize-none rounded-md bg-transparent p-4 font-mono text-sm focus:outline-none"
            spellCheck={false}
          />
        </StudioPanel>

        <StudioPanel
          title={labels.output}
          actions={<CopyButton value={output} label={labels.copy} />}
          className={
            error
              ? "border-destructive/50 bg-destructive/5"
              : status
                ? "border-emerald-500/50 bg-emerald-500/5"
                : ""
          }
        >
          {error ? (
            <div className="h-[400px] p-4 text-sm text-destructive font-mono whitespace-pre-wrap">
              {error}
            </div>
          ) : (
            <textarea
              value={output}
              readOnly
              placeholder={labels.placeholder}
              className="h-[400px] w-full resize-none rounded-md bg-transparent p-4 font-mono text-sm focus:outline-none text-muted-foreground"
              spellCheck={false}
            />
          )}
          {status && !error && !output ? (
            <div className="absolute inset-0 flex items-center justify-center text-emerald-600 font-medium">
              {status}
            </div>
          ) : null}
        </StudioPanel>
      </ToolStudio>
    </div>
  );
}

export default JsonFormatterTool;
