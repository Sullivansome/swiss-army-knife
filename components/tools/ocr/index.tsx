"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";

import type { LoggerMessage, Worker } from "tesseract.js";

import { Button } from "@/components/ui/button";
import { formatOcrProgress, shouldResetWorker } from "@/lib/ocr";

export type OcrLabels = {
  upload: string;
  helper: string;
  language: string;
  languages: {
    eng: string;
    chi_sim: string;
  };
  run: string;
  result: string;
  copy: string;
  processing: string;
  error: string;
  preview: string;
};

type Props = {
  labels: OcrLabels;
};

export function OcrTool({ labels }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [language, setLanguage] = useState<keyof OcrLabels["languages"]>("eng");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const workerRef = useRef<Worker | null>(null);
  const langRef = useRef<string>("");

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFile = (files: FileList | null) => {
    const next = files?.[0];
    if (!next) return;
    setFile(next);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(next));
  };

  const ensureWorker = async () => {
    const Tesseract = await import("tesseract.js");

    const create = async (lang: string) => {
      const worker = await Tesseract.createWorker(lang, undefined, {
        logger: (message: LoggerMessage) => {
          if (message.status === "recognizing text") {
            setStatus(formatOcrProgress(labels.processing, message.progress));
          }
        },
      });
      await worker.load();
      return worker;
    };

    if (!workerRef.current) {
      workerRef.current = await create(language);
      langRef.current = language;
      return workerRef.current;
    }

    if (shouldResetWorker(langRef.current, language)) {
      await workerRef.current.terminate();
      workerRef.current = await create(language);
      langRef.current = language;
    }

    return workerRef.current;
  };

  const run = async () => {
    if (!file) {
      setStatus(labels.error);
      return;
    }
    setLoading(true);
    setStatus(labels.processing);
    try {
      const worker = await ensureWorker();
      const result = await worker.recognize(file);
      setText(result.data.text);
      setStatus("");
    } catch (error) {
      console.error("ocr", error);
      setStatus(labels.error);
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("copy", error);
    }
  };

  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer flex-col gap-2 text-sm font-medium text-foreground">
        {labels.upload}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => handleFile(event.target.files)}
        />
        <span className="rounded-lg border px-4 py-2 text-center text-sm text-muted-foreground">
          {labels.helper}
        </span>
      </label>

      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">
          {labels.language}
        </label>
        <select
          value={language}
          onChange={(event) =>
            setLanguage(event.target.value as keyof OcrLabels["languages"])
          }
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
        >
          <option value="eng">{labels.languages.eng}</option>
          <option value="chi_sim">{labels.languages.chi_sim}</option>
        </select>
      </div>

      {previewUrl ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            {labels.preview}
          </p>
          <div className="rounded-xl border bg-muted/30 p-3">
            <img
              src={previewUrl}
              alt={labels.preview}
              className="mx-auto max-h-72 w-full object-contain"
            />
          </div>
        </div>
      ) : null}

      <div className="flex gap-2">
        <Button size="sm" onClick={run} disabled={!file || loading}>
          {loading ? labels.processing : labels.run}
        </Button>
        <Button variant="outline" size="sm" onClick={copy} disabled={!text}>
          {labels.copy}
        </Button>
      </div>

      <textarea
        value={text}
        readOnly
        className="min-h-48 w-full rounded-lg border bg-muted/50 p-3 text-sm shadow-inner"
        placeholder={labels.result}
      />

      {status ? (
        <p className="text-sm text-muted-foreground">{status}</p>
      ) : null}
    </div>
  );
}
