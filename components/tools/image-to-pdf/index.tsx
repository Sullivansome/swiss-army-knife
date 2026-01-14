"use client";
/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { fitImageToPage, moveItem, removeItem } from "@/lib/image-to-pdf";

export type ImageToPdfLabels = {
  upload: string;
  helper: string;
  clear: string;
  generate: string;
  empty: string;
  reorder: string;
  moveUp: string;
  moveDown: string;
  remove: string;
  processing: string;
  success: string;
  error: string;
};

type ImageEntry = {
  id: string;
  name: string;
  dataUrl: string;
};

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const localReader = new FileReader();
    localReader.onload = () => resolve(localReader.result as string);
    localReader.onerror = () => reject(localReader.error);
    localReader.readAsDataURL(file);
  });
}

type Props = {
  labels: ImageToPdfLabels;
};

export function ImageToPdfTool({ labels }: Props) {
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const hasImages = images.length > 0;

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const entries = await Promise.all(
      Array.from(files).map(async (file) => ({
        id:
          crypto.randomUUID?.() ??
          `${file.name}-${Date.now()}-${Math.random()}`,
        name: file.name,
        dataUrl: await readAsDataUrl(file),
      })),
    );
    setImages((prev) => [...prev, ...entries]);
    setStatus("");
  };

  const moveImage = (index: number, direction: number) => {
    setImages((prev) => moveItem(prev, index, direction));
  };

  const removeImage = (index: number) => {
    setImages((prev) => removeItem(prev, index));
  };

  const generatePdf = async () => {
    if (!images.length) {
      setStatus(labels.empty);
      return;
    }
    setLoading(true);
    setStatus(labels.processing);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "px", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      for (const [index, image] of images.entries()) {
        if (index !== 0) {
          doc.addPage();
        }
        const element = await loadImage(image.dataUrl);
        const { width, height, x, y } = fitImageToPage(
          element.width,
          element.height,
          pageWidth,
          pageHeight,
        );
        const format = image.dataUrl.includes("png") ? "PNG" : "JPEG";
        doc.addImage(image.dataUrl, format, x, y, width, height);
      }

      doc.save("images.pdf");
      setStatus(labels.success);
    } catch (error) {
      console.error("pdf error", error);
      setStatus(labels.error);
    } finally {
      setLoading(false);
    }
  };

  const previews = useMemo(() => images, [images]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer flex-col gap-1 text-sm font-medium text-foreground">
          {labels.upload}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => handleFiles(event.target.files)}
            className="hidden"
          />
          <span className="rounded-lg border px-4 py-2 text-center text-sm text-muted-foreground">
            {labels.helper}
          </span>
        </label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setImages([])}
          disabled={!hasImages}
        >
          {labels.clear}
        </Button>
        <Button
          size="sm"
          onClick={generatePdf}
          disabled={!hasImages || loading}
        >
          {loading ? labels.processing : labels.generate}
        </Button>
      </div>

      {hasImages ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{labels.reorder}</p>
          <ul className="space-y-3">
            {previews.map((image, index) => (
              <li
                key={image.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <img
                  src={image.dataUrl}
                  alt={image.name}
                  className="h-16 w-16 rounded object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {image.name}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveImage(index, -1)}
                    disabled={index === 0}
                  >
                    {labels.moveUp}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveImage(index, 1)}
                    disabled={index === previews.length - 1}
                  >
                    {labels.moveDown}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeImage(index)}
                >
                  {labels.remove}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{labels.empty}</p>
      )}

      {status ? (
        <p className="text-sm text-muted-foreground">{status}</p>
      ) : null}
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
