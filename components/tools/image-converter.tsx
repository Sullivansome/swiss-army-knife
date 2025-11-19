"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export type ImageConverterLabels = {
  upload: string;
  helper: string;
  formatLabel: string;
  convert: string;
  download: string;
  processing: string;
  error: string;
  inputLabel: string;
  outputLabel: string;
};

type Props = {
  labels: ImageConverterLabels;
};

type Preview = {
  file: File;
  url: string;
};

export function ImageConverterTool({ labels }: Props) {
  const [file, setFile] = useState<Preview | null>(null);
  const [output, setOutput] = useState<Preview | null>(null);
  const [format, setFormat] = useState("png");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (file) URL.revokeObjectURL(file.url);
      if (output) URL.revokeObjectURL(output.url);
    };
  }, [file, output]);

  const handleFile = (files: FileList | null) => {
    const next = files?.[0];
    if (!next) return;
    if (file) URL.revokeObjectURL(file.url);
    setFile({ file: next, url: URL.createObjectURL(next) });
    setOutput(null);
  };

  const convert = async () => {
    if (!file) {
      setStatus(labels.error);
      return;
    }
    setLoading(true);
    setStatus("");
    try {
      const image = await loadImage(file.url);
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("canvas");
      ctx.drawImage(image, 0, 0);
      const mime = format === "jpg" ? "image/jpeg" : `image/${format}`;
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mime, 0.95));
      if (!blob) throw new Error("blob");
      const converted = new File([blob], file.file.name.replace(/\.[^.]+$/, `.${format}`), { type: mime });
      if (output) URL.revokeObjectURL(output.url);
      setOutput({ file: converted, url: URL.createObjectURL(converted) });
    } catch (error) {
      console.error("convert", error);
      setStatus(labels.error);
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!output) return;
    const link = document.createElement("a");
    link.href = output.url;
    link.download = output.file.name;
    link.click();
  };

  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer flex-col gap-2 text-sm font-medium text-foreground">
        {labels.upload}
        <input type="file" accept="image/*" onChange={(event) => handleFile(event.target.files)} className="hidden" />
        <span className="rounded-lg border px-4 py-2 text-center text-sm text-muted-foreground">{labels.helper}</span>
      </label>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{labels.formatLabel}</label>
        <select value={format} onChange={(event) => setFormat(event.target.value)} className="w-full rounded-lg border bg-background px-3 py-2 text-sm">
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
          <option value="webp">WebP</option>
        </select>
      </div>

      <Button size="sm" onClick={convert} disabled={!file || loading}>
        {loading ? labels.processing : labels.convert}
      </Button>

      {file ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">{labels.inputLabel}</p>
            <img src={file.url} alt="input" className="rounded-lg border object-cover" />
          </div>
          {output ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">{labels.outputLabel}</p>
                <Button variant="outline" size="sm" onClick={download}>
                  {labels.download}
                </Button>
              </div>
              <img src={output.url} alt="output" className="rounded-lg border object-cover" />
            </div>
          ) : null}
        </div>
      ) : null}

      {status ? <p className="text-sm text-destructive">{status}</p> : null}
    </div>
  );
}

async function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
