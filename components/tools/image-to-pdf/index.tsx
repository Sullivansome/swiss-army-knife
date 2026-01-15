"use client";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  ArrowDown,
  ArrowUp,
  Download,
  File as FileIcon,
  FileImage,
  GripVertical,
  Loader2,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { WidgetCard } from "@/components/ui/widget-card";
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

  const handleFileSelect = async (file: File) => {
    const entry = {
      id:
        crypto.randomUUID?.() ?? `${file.name}-${Date.now()}-${Math.random()}`,
      name: file.name,
      dataUrl: await readAsDataUrl(file),
    };
    setImages((prev) => [...prev, entry]);
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
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
        <div className="space-y-6">
          <WidgetCard title="Add Images" className="h-full">
            <FileDropzone
              accept="image/*"
              label={labels.upload}
              helperText={labels.helper}
              onFileSelect={handleFileSelect}
              className="h-48"
            />

            <div className="mt-6">
              <Button
                size="lg"
                onClick={generatePdf}
                disabled={!hasImages || loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {labels.processing}
                  </>
                ) : (
                  <>
                    <FileIcon className="mr-2 h-4 w-4" />
                    {labels.generate}
                  </>
                )}
              </Button>

              {hasImages && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setImages([])}
                  className="w-full mt-2"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {labels.clear}
                </Button>
              )}
            </div>
          </WidgetCard>
        </div>

        <div className="space-y-6">
          <WidgetCard
            title={`Selected Images (${images.length})`}
            description={labels.reorder}
            className="min-h-[500px]"
          >
            {hasImages ? (
              <ul className="space-y-3">
                {previews.map((image, index) => (
                  <li
                    key={image.id}
                    className="group flex items-center gap-4 rounded-xl border bg-card p-3 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted/20 border">
                      <img
                        src={image.dataUrl}
                        alt={image.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className="truncate text-sm font-medium text-foreground"
                        title={image.name}
                      >
                        {image.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Page {index + 1}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => moveImage(index, -1)}
                        disabled={index === 0}
                        title={labels.moveUp}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => moveImage(index, 1)}
                        disabled={index === previews.length - 1}
                        title={labels.moveDown}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <div className="w-px h-4 bg-border mx-1" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeImage(index)}
                        title={labels.remove}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex h-[300px] flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed border-muted rounded-xl bg-muted/5">
                <FileImage className="h-12 w-12 opacity-20 mb-3" />
                <p className="font-medium">{labels.empty}</p>
                <p className="text-sm opacity-60">
                  Upload images to get started
                </p>
              </div>
            )}
          </WidgetCard>
        </div>
      </div>
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

export default ImageToPdfTool;
