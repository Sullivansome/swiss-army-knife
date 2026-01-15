"use client";

import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { StudioPanel } from "@/components/ui/studio/studio-panel";
import { StudioToolbar } from "@/components/ui/studio/studio-toolbar";
import { ToolStudio } from "@/components/ui/studio/tool-studio";
import { parseCsvToJson, parseJsonToCsv } from "@/lib/csv-json";

export type CsvJsonLabels = {
  csvInput: string;
  jsonOutput: string;
  convertToJson: string;
  convertToCsv: string;
  copyCsv: string;
  copyJson: string;
  placeholder: string;
  error: string;
};

type Props = {
  labels: CsvJsonLabels;
};

export function CsvJsonConverterTool({ labels }: Props) {
  const [csvText, setCsvText] = useState("");
  const [jsonText, setJsonText] = useState("");
  const [status, setStatus] = useState<string>("");

  const csvToJson = async () => {
    if (!csvText.trim()) {
      setStatus(labels.error);
      return;
    }
    try {
      const result = parseCsvToJson(csvText);
      setJsonText(JSON.stringify(result, null, 2));
      setStatus("");
    } catch (error) {
      console.error("csv parse", error);
      setStatus(labels.error);
    }
  };

  const jsonToCsv = async () => {
    if (!jsonText.trim()) {
      setStatus(labels.error);
      return;
    }
    try {
      const csv = parseJsonToCsv(jsonText);
      setCsvText(csv);
      setStatus("");
    } catch (error) {
      console.error("json parse", error);
      setStatus(labels.error);
    }
  };

  const handleClear = () => {
    setCsvText("");
    setJsonText("");
    setStatus("");
  };

  return (
    <div className="flex flex-col">
      <StudioToolbar>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={csvToJson}>
            {labels.convertToJson}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm" onClick={jsonToCsv}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {labels.convertToCsv}
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </StudioToolbar>

      <ToolStudio layout="split">
        <StudioPanel
          title={labels.csvInput}
          actions={<CopyButton value={csvText} label={labels.copyCsv} />}
        >
          <textarea
            value={csvText}
            onChange={(event) => setCsvText(event.target.value)}
            placeholder={labels.placeholder}
            className="h-[500px] w-full resize-none rounded-md bg-transparent p-4 font-mono text-sm focus:outline-none"
          />
        </StudioPanel>

        <StudioPanel
          title={labels.jsonOutput}
          actions={<CopyButton value={jsonText} label={labels.copyJson} />}
        >
          <textarea
            value={jsonText}
            onChange={(event) => setJsonText(event.target.value)}
            placeholder={labels.placeholder}
            className="h-[500px] w-full resize-none rounded-md bg-transparent p-4 font-mono text-sm focus:outline-none"
          />
        </StudioPanel>
      </ToolStudio>

      {status && (
        <div className="mt-4 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {status}
        </div>
      )}
    </div>
  );
}

export default CsvJsonConverterTool;
