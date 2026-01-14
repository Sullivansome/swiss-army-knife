"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
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

  const copy = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("copy", error);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">{labels.csvInput}</label>
          <Button variant="outline" size="sm" onClick={() => copy(csvText)} disabled={!csvText}>
            {labels.copyCsv}
          </Button>
        </div>
        <textarea
          value={csvText}
          onChange={(event) => setCsvText(event.target.value)}
          placeholder={labels.placeholder}
          className="min-h-48 w-full rounded-lg border bg-background p-3 text-sm shadow-inner"
        />
        <Button variant="default" size="sm" onClick={csvToJson}>
          {labels.convertToJson}
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">{labels.jsonOutput}</label>
          <Button variant="outline" size="sm" onClick={() => copy(jsonText)} disabled={!jsonText}>
            {labels.copyJson}
          </Button>
        </div>
        <textarea
          value={jsonText}
          onChange={(event) => setJsonText(event.target.value)}
          placeholder={labels.placeholder}
          className="min-h-48 w-full rounded-lg border bg-background p-3 text-sm shadow-inner"
        />
        <Button variant="default" size="sm" onClick={jsonToCsv}>
          {labels.convertToCsv}
        </Button>
      </div>

      {status ? <p className="md:col-span-2 text-sm text-destructive">{status}</p> : null}
    </div>
  );
}
