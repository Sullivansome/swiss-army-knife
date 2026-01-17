"use client";

import { Link } from "lucide-react";
import type { QrContent } from "@/lib/qr-content";

interface UrlFieldsProps {
  data: QrContent["url"];
  onChange: (data: QrContent["url"]) => void;
  labels: {
    placeholder: string;
  };
}

export function UrlFields({ data, onChange, labels }: UrlFieldsProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="qr-url"
        className="text-sm font-medium text-foreground flex items-center gap-2"
      >
        <Link className="h-4 w-4 text-muted-foreground" />
        URL
      </label>
      <input
        id="qr-url"
        type="url"
        value={data.value}
        onChange={(e) => onChange({ value: e.target.value })}
        placeholder={labels.placeholder}
        className="w-full rounded-xl border bg-background p-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

export default UrlFields;
