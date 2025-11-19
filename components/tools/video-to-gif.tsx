"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";

import type { FFmpeg } from "@ffmpeg/ffmpeg";

import { Button } from "@/components/ui/button";

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
  const fetchFileRef = useRef<((file: File | Blob | string) => Promise<Uint8Array>) | null>(null);

  useEffect(() => {
    return () => {
      if (output) URL.revokeObjectURL(output);
    };
  }, [output]);

  const handleFile = (files: FileList | null) => {
    const next = files?.[0];
    if (!next) return;
    setFile(next);
    setOutput("");
  };

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
      await ffmpeg.exec([
        "-ss",
        start,
        "-t",
        duration,
        "-i",
        "input.mp4",
        "-vf",
        `scale=${width}:-1:flags=lanczos`,
        "-f",
        "gif",
        "output.gif",
      ]);
      const data = (await ffmpeg.readFile("output.gif")) as Uint8Array;
      const typed = new Uint8Array(data);
      const url = URL.createObjectURL(new Blob([typed.buffer], { type: "image/gif" }));
      setOutput(url);
      await Promise.all([ffmpeg.deleteFile("input.mp4"), ffmpeg.deleteFile("output.gif")]);
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
    <div className="space-y-4">
      <label className="flex cursor-pointer flex-col gap-2 text-sm font-medium text-foreground">
        {labels.upload}
        <input type="file" accept="video/*" className="hidden" onChange={(event) => handleFile(event.target.files)} />
        <span className="rounded-lg border px-4 py-2 text-center text-sm text-muted-foreground">{labels.helper}</span>
      </label>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label={labels.start} value={start} onChange={setStart} />
        <Field label={labels.duration} value={duration} onChange={setDuration} />
        <Field label={labels.width} value={width} onChange={setWidth} />
      </div>

      <div className="flex gap-2">
        <Button size="sm" onClick={convert} disabled={!file || loading}>
          {loading ? labels.processing : labels.convert}
        </Button>
        <Button variant="outline" size="sm" onClick={download} disabled={!output}>
          {labels.download}
        </Button>
      </div>

      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}

      {output ? (
        <div className="rounded-xl border bg-muted/30 p-4 text-center">
          <img src={output} alt="gif" className="mx-auto max-h-80" />
        </div>
      ) : null}
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function Field({ label, value, onChange }: FieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
      />
    </div>
  );
}
