"use client";

import { File as FileIcon, Upload, X } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileDropzoneProps extends React.HTMLAttributes<HTMLDivElement> {
  accept?: string;
  maxSize?: number;
  onFileSelect: (file: File) => void;
  file?: File | null;
  onClear?: () => void;
  label?: string;
  helperText?: string;
}

export function FileDropzone({
  accept,
  maxSize,
  onFileSelect,
  file,
  onClear,
  label = "Upload file",
  helperText = "Drag and drop or click to upload",
  className,
  ...props
}: FileDropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSelect(droppedFile);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSelect(selectedFile);
    }
  };

  const validateAndSelect = (file: File) => {
    onFileSelect(file);
  };

  if (file) {
    return (
      <div
        className={cn("relative rounded-xl border bg-muted/30 p-6", className)}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background shadow-sm">
            <FileIcon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-foreground">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          {onClear && (
            <Button variant="ghost" size="icon" onClick={onClear}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "w-full cursor-pointer rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/5 p-10 transition-all hover:border-primary/50 hover:bg-muted/10",
        isDragging && "border-primary bg-primary/5 ring-4 ring-primary/10",
        className,
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border/50">
          <Upload className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-base font-semibold text-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">{helperText}</p>
        </div>
      </div>
    </button>
  );
}
