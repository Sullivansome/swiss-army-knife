"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { decodeBase64, encodeBase64 } from "@/lib/base64";

type Labels = {
  input: string;
  output: string;
  clear: string;
  copy: string;
  error: string;
  encode: string;
  decode: string;
  placeholder: string;
};

type Props = {
  labels: Labels;
};

export function Base64Tool({ labels }: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleEncode = () => {
    try {
      setOutput(encodeBase64(input));
      setError("");
    } catch (err) {
      console.error(err);
      setError(labels.error);
    }
  };

  const handleDecode = () => {
    try {
      setOutput(decodeBase64(input));
      setError("");
    } catch (err) {
      console.error(err);
      setError(labels.error);
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
    } catch (err) {
      console.error("copy failed", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            {labels.input}
          </label>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleClear}>
              {labels.clear}
            </Button>
            <Button variant="default" size="sm" onClick={handleEncode}>
              {labels.encode}
            </Button>
            <Button variant="default" size="sm" onClick={handleDecode}>
              {labels.decode}
            </Button>
          </div>
        </div>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={labels.placeholder}
          className="min-h-40 w-full rounded-lg border bg-background p-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-ring"
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
          className="min-h-32 w-full cursor-text rounded-lg border bg-muted/50 p-3 text-sm shadow-inner"
        />
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}
    </div>
  );
}
