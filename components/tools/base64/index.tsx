"use client";

import { ArrowRightLeft, FileCode, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { StudioPanel } from "@/components/ui/studio/studio-panel";
import { StudioToolbar } from "@/components/ui/studio/studio-toolbar";
import { ToolStudio } from "@/components/ui/studio/tool-studio";
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
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const handleAction = () => {
    try {
      if (mode === "encode") {
        setOutput(encodeBase64(input));
      } else {
        setOutput(decodeBase64(input));
      }
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

  const toggleMode = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput(output);
    setOutput("");
    setError("");
  };

  return (
    <div className="flex flex-col">
      <StudioToolbar>
        <div className="flex items-center gap-2">
          <Button
            variant={mode === "encode" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMode("encode")}
          >
            {labels.encode}
          </Button>
          <Button
            variant={mode === "decode" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMode("decode")}
          >
            {labels.decode}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMode}
            title="Swap Input/Output"
          >
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Swap
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {labels.clear}
          </Button>
        </div>
      </StudioToolbar>

      <ToolStudio>
        <StudioPanel
          title={labels.input}
          actions={
            <div className="flex gap-2">
              <CopyButton value={input} size="icon-sm" variant="ghost" />
            </div>
          }
        >
          <textarea
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
            placeholder={labels.placeholder}
            className="h-[300px] w-full resize-none rounded-md bg-transparent p-4 font-mono text-sm focus:outline-none"
          />
        </StudioPanel>

        <StudioPanel
          title={labels.output}
          actions={<CopyButton value={output} label={labels.copy} />}
          className={error ? "border-destructive/50 bg-destructive/5" : ""}
        >
          {error ? (
            <div className="h-[300px] p-4 text-sm text-destructive font-mono">
              {error}
            </div>
          ) : (
            <textarea
              value={output}
              readOnly
              className="h-[300px] w-full resize-none rounded-md bg-transparent p-4 font-mono text-sm focus:outline-none text-muted-foreground"
            />
          )}
        </StudioPanel>
      </ToolStudio>

      <div className="mt-6 flex justify-center">
        <Button size="lg" onClick={handleAction} className="px-8">
          {mode === "encode" ? labels.encode : labels.decode}
          <FileCode className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default Base64Tool;
