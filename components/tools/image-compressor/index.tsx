"use client";

/* eslint-disable @next/next/no-img-element */

import {
  ArrowRight,
  Download,
  File as FileIcon,
  Image as ImageIcon,
  Loader2,
  Settings2,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { WidgetCard } from "@/components/ui/widget-card";
import {
  computeTargetSizeMB,
  formatCompressionRatio,
  formatFileSize,
} from "@/lib/image-compression";

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

  const handleFile = (selectedFile: File) => {
    if (file) URL.revokeObjectURL(file.url);
    setFile({ file: selectedFile, url: URL.createObjectURL(selectedFile) });
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
      const imageCompression = (await import("browser-image-compression"))
        .default;
      const targetSize = computeTargetSizeMB(file.file.size, quality);
      const compressedBlob = await imageCompression(file.file, {
        maxSizeMB: targetSize,
        initialQuality: quality,
        useWebWorker: true,
      });
      const compressedFile = new File(
        [compressedBlob],
        file.file.name.replace(/\.[^.]+$/, "-compressed.jpg"),
        {
          type: compressedBlob.type || "image/jpeg",
        },
      );
      if (result) URL.revokeObjectURL(result.url);
      setResult({
        file: compressedFile,
        url: URL.createObjectURL(compressedFile),
      });
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

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <WidgetCard title="Input Image" className="h-full">
            <FileDropzone
              accept="image/*"
              label={labels.upload}
              helperText={labels.helper}
              onFileSelect={handleFile}
              file={file?.file}
              onClear={() => {
                setFile(null);
                setResult(null);
              }}
              className="h-64"
            />

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Settings2 className="h-4 w-4" />
                  <span>Compression Level</span>
                </div>
                <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {Math.round(quality * 100)}%
                </span>
              </div>

              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={quality}
                onChange={(event) => setQuality(Number(event.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />

              <Button
                size="lg"
                onClick={compress}
                disabled={!file || loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {labels.processing}
                  </>
                ) : (
                  <>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    {labels.compress}
                  </>
                )}
              </Button>
            </div>
          </WidgetCard>
        </div>

        <div className="space-y-6">
          <WidgetCard title="Comparison" className="h-full flex flex-col">
            <div className="flex-1 space-y-6">
              {file && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground uppercase tracking-wider font-medium">
                    <span>Original</span>
                    <span>{formatFileSize(file.file.size)}</span>
                  </div>
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted/20">
                    <img
                      src={file.url}
                      alt="Original"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              )}

              {result ? (
                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between text-xs text-muted-foreground uppercase tracking-wider font-medium">
                    <span>Compressed</span>
                    <span className="text-emerald-500 font-bold">
                      {formatFileSize(result.file.size)}
                    </span>
                  </div>
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted/20 ring-2 ring-emerald-500/20">
                    <img
                      src={result.url}
                      alt="Compressed"
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="rounded-lg bg-emerald-500/10 p-3 text-center text-sm font-medium text-emerald-600 border border-emerald-500/20">
                    {labels.ratio.replace(
                      "{ratio}",
                      formatCompressionRatio(file!.file.size, result.file.size),
                    )}
                  </div>

                  <Button
                    onClick={download}
                    variant="default"
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {labels.download}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted bg-muted/5 py-12 text-center text-muted-foreground">
                  <ImageIcon className="h-10 w-10 opacity-20 mb-2" />
                  <p className="text-sm">Processed image will appear here</p>
                </div>
              )}
            </div>

            {status && !result && (
              <p className="mt-4 text-center text-sm text-muted-foreground animate-pulse">
                {status}
              </p>
            )}
          </WidgetCard>
        </div>
      </div>
    </div>
  );
}

export default ImageCompressorTool;
