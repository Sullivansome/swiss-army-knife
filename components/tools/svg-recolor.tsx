"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export type SvgRecolorLabels = {
  upload: string;
  helper: string;
  colorLabel: string;
  apply: string;
  download: string;
  preview: string;
  error: string;
};

type Props = {
  labels: SvgRecolorLabels;
};

export function SvgRecolorTool({ labels }: Props) {
  const [source, setSource] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [color, setColor] = useState("#0f172a");
  const [status, setStatus] = useState<string>("");

  const handleFile = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const text = await file.text();
    setSource(text);
    setOutput(text);
  };

  const applyColor = () => {
    if (!source) {
      setStatus(labels.error);
      return;
    }
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(source, "image/svg+xml");
      doc.querySelectorAll<SVGElement>("*").forEach((node) => {
        if (node.tagName.toLowerCase() === "svg") {
          if (!node.hasAttribute("fill") || node.getAttribute("fill") !== "none") {
            node.setAttribute("fill", color);
          }
          return;
        }
        if (node.getAttribute("fill") !== "none") {
          node.setAttribute("fill", color);
        }
        if (node.getAttribute("stroke")) {
          node.setAttribute("stroke", color);
        }
      });
      const serializer = new XMLSerializer();
      const changed = serializer.serializeToString(doc);
      setOutput(changed);
      setStatus("");
    } catch (error) {
      console.error("svg", error);
      setStatus(labels.error);
    }
  };

  const download = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "icon-colored.svg";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer flex-col gap-2 text-sm font-medium text-foreground">
        {labels.upload}
        <input type="file" accept="image/svg+xml" className="hidden" onChange={(event) => handleFile(event.target.files)} />
        <span className="rounded-lg border px-4 py-2 text-center text-sm text-muted-foreground">{labels.helper}</span>
      </label>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{labels.colorLabel}</label>
        <input type="color" value={color} onChange={(event) => setColor(event.target.value)} />
      </div>

      <div className="flex gap-2">
        <Button size="sm" onClick={applyColor} disabled={!source}>
          {labels.apply}
        </Button>
        <Button variant="outline" size="sm" onClick={download} disabled={!output}>
          {labels.download}
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">{labels.preview}</p>
        <div className="rounded-xl border bg-muted/30 p-4">
          {output ? (
            <div className="flex items-center justify-center" dangerouslySetInnerHTML={{ __html: output }} />
          ) : (
            <p className="text-sm text-muted-foreground">{labels.helper}</p>
          )}
        </div>
      </div>

      {status ? <p className="text-sm text-destructive">{status}</p> : null}
    </div>
  );
}
