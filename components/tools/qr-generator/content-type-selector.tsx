"use client";

import { Link, Mail, MessageSquare, Phone, Type, Wifi } from "lucide-react";
import type { QrContentType } from "@/lib/qr-content";

const CONTENT_TYPE_CONFIG: {
  type: QrContentType;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { type: "url", icon: Link },
  { type: "text", icon: Type },
  { type: "wifi", icon: Wifi },
  { type: "email", icon: Mail },
  { type: "sms", icon: MessageSquare },
  { type: "phone", icon: Phone },
];

interface ContentTypeSelectorProps {
  value: QrContentType;
  onChange: (type: QrContentType) => void;
  labels: {
    label: string;
    url: string;
    text: string;
    wifi: string;
    email: string;
    sms: string;
    phone: string;
  };
}

export function ContentTypeSelector({
  value,
  onChange,
  labels,
}: ContentTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {labels.label}
      </label>
      <div className="flex flex-wrap gap-2">
        {CONTENT_TYPE_CONFIG.map(({ type, icon: Icon }) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all
              hover:ring-2 hover:ring-primary/20
              ${
                value === type
                  ? "ring-2 ring-primary border-primary bg-primary/5"
                  : "border-border"
              }
            `}
          >
            <Icon className="h-3.5 w-3.5" />
            {labels[type]}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ContentTypeSelector;
