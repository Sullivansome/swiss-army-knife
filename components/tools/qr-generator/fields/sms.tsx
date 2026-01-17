"use client";

import { MessageSquare } from "lucide-react";
import type { QrContent } from "@/lib/qr-content";

interface SmsFieldsProps {
  data: QrContent["sms"];
  onChange: (data: QrContent["sms"]) => void;
  labels: {
    phone: string;
    phonePlaceholder: string;
    message: string;
  };
}

export function SmsFields({ data, onChange, labels }: SmsFieldsProps) {
  const updateField = <K extends keyof QrContent["sms"]>(
    field: K,
    value: QrContent["sms"][K],
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        SMS
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <label htmlFor="sms-phone" className="text-sm text-muted-foreground">
          {labels.phone}
        </label>
        <input
          id="sms-phone"
          type="tel"
          value={data.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          placeholder={labels.phonePlaceholder}
          className="w-full rounded-xl border bg-background p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label htmlFor="sms-message" className="text-sm text-muted-foreground">
          {labels.message}
        </label>
        <textarea
          id="sms-message"
          value={data.message || ""}
          onChange={(e) => updateField("message", e.target.value)}
          rows={3}
          className="w-full resize-none rounded-xl border bg-background p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  );
}

export default SmsFields;
