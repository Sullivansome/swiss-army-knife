"use client";

/* eslint-disable @next/next/no-img-element */

import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { Download, Film, Loader2, PlayCircle, Settings2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { WidgetCard } from "@/components/ui/widget-card";
import { buildFfmpegArgs } from "@/lib/video-to-gif";

export type VideoToGifLabels = {
  upload: string;
  helper: string;
  start: string;
  duration: string;
  width: string;
  convert: string;
  download: string;
  processing: string;
  error: string;
};

type Props = {
  labels: VideoToGifLabels;
};

export function VideoToGifTool({ labels }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState<string>("");
  const [start, setStart] = useState("0");
  const [duration, setDuration] = useState("3");
  const [width, setWidth] = useState("480");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const fetchFileRef = useRef<
    ((file: File | Blob | string) => Promise<Uint8Array>) | null
  >(null);

  useEffect(() => {
    return () => {
      if (output) URL.revokeObjectURL(output);
    };
  }, [output]);

  const ensureFfmpeg = async () => {
    if (ffmpegRef.current && fetchFileRef.current) return;
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    const { fetchFile } = await import("@ffmpeg/util");
    const ffmpeg = new FFmpeg();
    await ffmpeg.load();
    ffmpegRef.current = ffmpeg;
    fetchFileRef.current = fetchFile;
  };

  const convert = async () => {
    if (!file) {
      setStatus(labels.error);
      return;
    }
    setLoading(true);
    setStatus(labels.processing);
    try {
      await ensureFfmpeg();
      const ffmpeg = ffmpegRef.current!;
      const fetchFile = fetchFileRef.current!;
      await ffmpeg.writeFile("input.mp4", await fetchFile(file));
      await ffmpeg.exec(buildFfmpegArgs({ start, duration, width }));
      const data = (await ffmpeg.readFile("output.gif")) as Uint8Array;
      const typed = new Uint8Array(data);
      const url = URL.createObjectURL(
        new Blob([typed.buffer], { type: "image/gif" }),
      );
      setOutput(url);
      await Promise.all([
        ffmpeg.deleteFile("input.mp4"),
        ffmpeg.deleteFile("output.gif"),
      ]);
      setStatus("");
    } catch (error) {
      console.error("ffmpeg", error);
      setStatus(labels.error);
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!output) return;
    const link = document.createElement("a");
    link.href = output;
    link.download = "video.gif";
    link.click();
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <WidgetCard title="Source Video" className="h-full">
            <FileDropzone
              accept="video/*"
              label={labels.upload}
              helperText={labels.helper}
              onFileSelect={(f) => {
                setFile(f);
                setOutput("");
              }}
              file={file}
              onClear={() => {
                setFile(null);
                setOutput("");
              }}
              className="h-64"
            />

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Settings2 className="h-4 w-4" />
                <span>Conversion Settings</span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Field
                  label={labels.start}
                  value={start}
                  onChange={setStart}
                  suffix="sec"
                />
                <Field
                  label={labels.duration}
                  value={duration}
                  onChange={setDuration}
                  suffix="sec"
                />
                <Field
                  label={labels.width}
                  value={width}
                  onChange={setWidth}
                  suffix="px"
                />
              </div>

              <Button
                size="lg"
                onClick={convert}
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
                    <Film className="mr-2 h-4 w-4" />
                    {labels.convert}
                  </>
                )}
              </Button>
            </div>
          </WidgetCard>
        </div>

        <div className="space-y-6">
          <WidgetCard
            title="Output GIF"
            className="flex h-full flex-col justify-between"
          >
            <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-muted bg-muted/20 p-8">
              {output ? (
                <img
                  src={output}
                  alt="gif"
                  className="max-h-[300px] rounded-lg shadow-sm"
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <PlayCircle className="mx-auto mb-2 h-12 w-12 opacity-20" />
                  <p className="text-sm">Processed GIF will appear here</p>
                </div>
              )}
            </div>

            <div className="mt-6">
              {status && !output && (
                <p className="text-center text-sm text-muted-foreground animate-pulse">
                  {status}
                </p>
              )}
              {output && (
                <Button onClick={download} variant="default" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  {labels.download}
                </Button>
              )}
            </div>
          </WidgetCard>
        </div>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
};

function Field({ label, value, onChange, suffix }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          min={0}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export default VideoToGifTool;
