"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export type ImageCompressorLabels = {
  upload: string;
  helper: string;
  quality: string;
  compress: string;
  original: string;
  compressed: string;
  download: string;
  ratio: string;
  processing: string;
  error: string;
};

type FilePreview = {
  file: File;
  url: string;
};

type Props = {
  labels: ImageCompressorLabels;
};

export function ImageCompressorTool({ labels }: Props) {
  const [file, setFile] = useState<FilePreview | null>(null);
  const [result, setResult] = useState<FilePreview | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (file) URL.revokeObjectURL(file.url);
      if (result) URL.revokeObjectURL(result.url);
    };
  }, [file, result]);

  const handleFile = (files: FileList | null) => {
    const next = files?.[0];
    if (!next) return;
    if (file) URL.revokeObjectURL(file.url);
    setFile({ file: next, url: URL.createObjectURL(next) });
    setResult(null);
  };

  const compress = async () => {
    if (!file) {
      setStatus(labels.error);
      return;
    }
    setLoading(true);
    setStatus(labels.processing);
    try {
      const imageCompression = (await import("browser-image-compression")).default;
      const targetSize = Math.max((file.file.size / (1024 * 1024)) * quality, 0.2);
      const compressedBlob = await imageCompression(file.file, {
        maxSizeMB: targetSize,
        initialQuality: quality,
        useWebWorker: true,
      });
      const compressedFile = new File([compressedBlob], file.file.name.replace(/\.[^.]+$/, "-compressed.jpg"), {
        type: compressedBlob.type || "image/jpeg",
      });
      if (result) URL.revokeObjectURL(result.url);
      setResult({ file: compressedFile, url: URL.createObjectURL(compressedFile) });
      setStatus("");
    } catch (error) {
      console.error("compress", error);
      setStatus(labels.error);
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result.url;
    link.download = result.file.name.replace(/\.[^.]+$/, "-compressed.jpg");
    link.click();
  };

  const formatSize = (size: number) => `${(size / 1024).toFixed(1)} KB`;

  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer flex-col gap-2 text-sm font-medium text-foreground">
        {labels.upload}
        <input type="file" accept="image/*" className="hidden" onChange={(event) => handleFile(event.target.files)} />
        <span className="rounded-lg border px-4 py-2 text-center text-sm text-muted-foreground">{labels.helper}</span>
      </label>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{labels.quality}</label>
        <input
          type="range"
          min={0.3}
          max={1}
          step={0.05}
          value={quality}
          onChange={(event) => setQuality(Number(event.target.value))}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">{Math.round(quality * 100)}%</p>
      </div>

      <Button size="sm" onClick={compress} disabled={!file || loading}>
        {loading ? labels.processing : labels.compress}
      </Button>

      {file ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">{labels.original}</p>
            <img src={file.url} alt="original" className="rounded-lg border object-cover" />
            <p className="text-xs text-muted-foreground">{formatSize(file.file.size)}</p>
          </div>
          {result ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">{labels.compressed}</p>
                <Button variant="outline" size="sm" onClick={download}>
                  {labels.download}
                </Button>
              </div>
              <img src={result.url} alt="compressed" className="rounded-lg border object-cover" />
              <p className="text-xs text-muted-foreground">
                {formatSize(result.file.size)} •
                {labels.ratio.replace("{ratio}", `${((result.file.size / file.file.size) * 100).toFixed(1)}%`)}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
    </div>
  );
}
