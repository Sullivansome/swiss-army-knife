"use client";

import { Mail } from "lucide-react";
import type { QrContent } from "@/lib/qr-content";

interface EmailFieldsProps {
  data: QrContent["email"];
  onChange: (data: QrContent["email"]) => void;
  labels: {
    address: string;
    addressPlaceholder: string;
    subject: string;
    body: string;
  };
}

export function EmailFields({ data, onChange, labels }: EmailFieldsProps) {
  const updateField = <K extends keyof QrContent["email"]>(
    field: K,
    value: QrContent["email"][K],
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Mail className="h-4 w-4 text-muted-foreground" />
        Email
      </div>

      {/* Email Address */}
      <div className="space-y-2">
        <label
          htmlFor="email-address"
          className="text-sm text-muted-foreground"
        >
          {labels.address}
        </label>
        <input
          id="email-address"
          type="email"
          value={data.address}
          onChange={(e) => updateField("address", e.target.value)}
          placeholder={labels.addressPlaceholder}
          className="w-full rounded-xl border bg-background p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <label
          htmlFor="email-subject"
          className="text-sm text-muted-foreground"
        >
          {labels.subject}
        </label>
        <input
          id="email-subject"
          type="text"
          value={data.subject || ""}
          onChange={(e) => updateField("subject", e.target.value)}
          className="w-full rounded-xl border bg-background p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Body */}
      <div className="space-y-2">
        <label htmlFor="email-body" className="text-sm text-muted-foreground">
          {labels.body}
        </label>
        <textarea
          id="email-body"
          value={data.body || ""}
          onChange={(e) => updateField("body", e.target.value)}
          rows={3}
          className="w-full resize-none rounded-xl border bg-background p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  );
}

export default EmailFields;
