"use client";

import { Wifi } from "lucide-react";
import type { QrContent, WifiEncryption } from "@/lib/qr-content";

interface WifiFieldsProps {
  data: QrContent["wifi"];
  onChange: (data: QrContent["wifi"]) => void;
  labels: {
    ssid: string;
    ssidPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    encryption: string;
    wpa: string;
    wep: string;
    none: string;
    hidden: string;
  };
}

const ENCRYPTION_OPTIONS: {
  value: WifiEncryption;
  labelKey: keyof Pick<WifiFieldsProps["labels"], "wpa" | "wep" | "none">;
}[] = [
  { value: "WPA", labelKey: "wpa" },
  { value: "WEP", labelKey: "wep" },
  { value: "nopass", labelKey: "none" },
];

export function WifiFields({ data, onChange, labels }: WifiFieldsProps) {
  const updateField = <K extends keyof QrContent["wifi"]>(
    field: K,
    value: QrContent["wifi"][K],
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Wifi className="h-4 w-4 text-muted-foreground" />
        WiFi
      </div>

      {/* Network Name */}
      <div className="space-y-2">
        <label htmlFor="wifi-ssid" className="text-sm text-muted-foreground">
          {labels.ssid}
        </label>
        <input
          id="wifi-ssid"
          type="text"
          value={data.ssid}
          onChange={(e) => updateField("ssid", e.target.value)}
          placeholder={labels.ssidPlaceholder}
          className="w-full rounded-xl border bg-background p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label
          htmlFor="wifi-password"
          className="text-sm text-muted-foreground"
        >
          {labels.password}
        </label>
        <input
          id="wifi-password"
          type="password"
          value={data.password}
          onChange={(e) => updateField("password", e.target.value)}
          placeholder={labels.passwordPlaceholder}
          disabled={data.encryption === "nopass"}
          className="w-full rounded-xl border bg-background p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Encryption Type */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">
          {labels.encryption}
        </label>
        <div className="flex flex-wrap gap-2">
          {ENCRYPTION_OPTIONS.map(({ value, labelKey }) => (
            <button
              key={value}
              type="button"
              onClick={() => updateField("encryption", value)}
              className={`
                px-3 py-1.5 rounded-lg border text-xs font-medium transition-all
                hover:ring-2 hover:ring-primary/20
                ${
                  data.encryption === value
                    ? "ring-2 ring-primary border-primary bg-primary/5"
                    : "border-border"
                }
              `}
            >
              {labels[labelKey]}
            </button>
          ))}
        </div>
      </div>

      {/* Hidden Network */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={data.hidden}
          onChange={(e) => updateField("hidden", e.target.checked)}
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
        />
        <span className="text-sm text-muted-foreground">{labels.hidden}</span>
      </label>
    </div>
  );
}

export default WifiFields;
