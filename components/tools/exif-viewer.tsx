"use client";

import { useState } from "react";
import exifr from "exifr";

import { Button } from "@/components/ui/button";
import { formatExifDate } from "@/lib/exif";

type Props = {
  labels: {
    upload: string;
    camera: string;
    model: string;
    datetime: string;
    noData: string;
    error: string;
    instruction: string;
  };
};

type ExifData = {
  Make?: string;
  Model?: string;
  DateTimeOriginal?: string | Date;
};

export function ExifViewerTool({ labels }: Props) {
  const [data, setData] = useState<ExifData | null>(null);
  const [error, setError] = useState<string>("");

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    setData(null);
    try {
      const parsed = await exifr.parse(file, ["Make", "Model", "DateTimeOriginal"]);
      if (parsed) {
        setData(parsed as ExifData);
      } else {
        setError(labels.noData);
      }
    } catch (err) {
      console.error(err);
      setError(labels.error);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{labels.instruction}</p>
      <div className="flex items-center gap-3">
        <label className="cursor-pointer rounded-lg border bg-background px-3 py-2 text-sm font-medium shadow-sm hover:bg-muted">
          {labels.upload}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
        <Button variant="ghost" disabled>
          {labels.camera}: {data?.Make ?? "--"}
        </Button>
        <Button variant="ghost" disabled>
          {labels.model}: {data?.Model ?? "--"}
        </Button>
        <Button variant="ghost" disabled>
          {labels.datetime}: {formatExifDate(data?.DateTimeOriginal)}
        </Button>
      </div>
      {error ? <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div> : null}
    </div>
  );
}
