"use client";

import { Play, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { StudioPanel } from "@/components/ui/studio/studio-panel";
import { StudioToolbar } from "@/components/ui/studio/studio-toolbar";
import { ToolStudio } from "@/components/ui/studio/tool-studio";
import { computeHash, type HashAlgorithm } from "@/lib/hash";
import { cn } from "@/lib/utils";

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

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const labelMap: Record<HashAlgorithm, string> = {
    md5: labels.md5,
    sha256: labels.sha256,
    sha512: labels.sha512,
  };

  return (
    <div className="flex flex-col">
      <StudioToolbar className="h-auto flex-wrap gap-4 py-3">
        <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            {labels.algo}
          </span>
          <div className="flex gap-1">
            {algorithms.map((algo) => (
              <button
                key={algo}
                type="button"
                onClick={() => setAlgorithm(algo)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-xs font-medium transition-all hover:bg-muted",
                  algorithm === algo
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-transparent bg-muted/50 text-muted-foreground",
                )}
              >
                {labelMap[algo]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleCompute}
            disabled={!input}
          >
            <Play className="mr-2 h-4 w-4" />
            {labels.compute}
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

      <ToolStudio layout="vertical">
        <StudioPanel
          title={labels.input}
          actions={<CopyButton value={input} size="icon-sm" variant="ghost" />}
        >
          <textarea
            id="hash-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={labels.placeholder}
            className="h-[200px] w-full resize-none rounded-md bg-transparent p-4 font-mono text-sm focus:outline-none"
          />
        </StudioPanel>

        <StudioPanel
          title={labels.hash}
          actions={<CopyButton value={output} label={labels.copy} />}
          className="bg-muted/10 border-muted"
        >
          <textarea
            value={output}
            readOnly
            placeholder={labels.placeholder}
            className="h-[150px] w-full resize-none rounded-md bg-transparent p-4 font-mono text-sm focus:outline-none text-muted-foreground"
          />
        </StudioPanel>
      </ToolStudio>
    </div>
  );
}

export default HashGeneratorTool;
