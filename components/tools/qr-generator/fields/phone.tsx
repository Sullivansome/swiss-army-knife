"use client";

import { Phone } from "lucide-react";
import type { QrContent } from "@/lib/qr-content";

interface PhoneFieldsProps {
  data: QrContent["phone"];
  onChange: (data: QrContent["phone"]) => void;
  labels: {
    number: string;
    placeholder: string;
  };
}

export function PhoneFields({ data, onChange, labels }: PhoneFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Phone className="h-4 w-4 text-muted-foreground" />
        Phone
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <label htmlFor="phone-number" className="text-sm text-muted-foreground">
          {labels.number}
        </label>
        <input
          id="phone-number"
          type="tel"
          value={data.value}
          onChange={(e) => onChange({ value: e.target.value })}
          placeholder={labels.placeholder}
          className="w-full rounded-xl border bg-background p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  );
}

export default PhoneFields;
