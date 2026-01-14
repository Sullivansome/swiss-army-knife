"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { computeHash, type HashAlgorithm } from "@/lib/hash";

type Props = {
  labels: {
    input: string;
    algo: string;
    md5: string;
    sha256: string;
    sha512: string;
    hash: string;
    compute: string;
    copy: string;
    placeholder: string;
  };
};

const algorithms: HashAlgorithm[] = ["md5", "sha256", "sha512"];

export function HashGeneratorTool({ labels }: Props) {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("md5");
  const [output, setOutput] = useState("");

  const handleCompute = async () => {
    const result = await computeHash(input, algorithm);
    setOutput(result);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  const labelMap: Record<HashAlgorithm, string> = {
    md5: labels.md5,
    sha256: labels.sha256,
    sha512: labels.sha512,
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label
          className="text-sm font-medium text-foreground"
          htmlFor="hash-input"
        >
          {labels.input}
        </label>
        <textarea
          id="hash-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={labels.placeholder}
          className="min-h-32 w-full rounded-lg border bg-background p-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-foreground">
          {labels.algo}
        </span>
        <div className="flex flex-wrap gap-2">
          {algorithms.map((algo) => (
            <button
              key={algo}
              type="button"
              onClick={() => setAlgorithm(algo)}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                algorithm === algo
                  ? "border-foreground bg-foreground text-background"
                  : "border-muted-foreground/40 text-foreground"
              }`}
            >
              {labelMap[algo]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="default" onClick={handleCompute} disabled={!input}>
          {labels.compute}
        </Button>
        <Button variant="outline" onClick={handleCopy} disabled={!output}>
          {labels.copy}
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          {labels.hash}
        </label>
        <textarea
          value={output}
          readOnly
          placeholder={labels.placeholder}
          className="min-h-24 w-full cursor-text rounded-lg border bg-muted/50 p-3 text-sm shadow-inner"
        />
      </div>
    </div>
  );
}

export default HashGeneratorTool;
