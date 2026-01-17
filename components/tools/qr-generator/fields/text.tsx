"use client";

import { Type } from "lucide-react";
import type { QrContent } from "@/lib/qr-content";

interface TextFieldsProps {
  data: QrContent["text"];
  onChange: (data: QrContent["text"]) => void;
  labels: {
    placeholder: string;
  };
}

export function TextFields({ data, onChange, labels }: TextFieldsProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="qr-text"
        className="text-sm font-medium text-foreground flex items-center gap-2"
      >
        <Type className="h-4 w-4 text-muted-foreground" />
        Text
      </label>
      <textarea
        id="qr-text"
        value={data.value}
        onChange={(e) => onChange({ value: e.target.value })}
        placeholder={labels.placeholder}
        className="h-32 w-full resize-none rounded-xl border bg-background p-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

export default TextFields;
