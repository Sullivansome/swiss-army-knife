"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { decodeBase64 } from "@/lib/base64";

type Labels = {
  inputLabel: string;
  placeholder: string;
  helper: string;
  headerTitle: string;
  payloadTitle: string;
  signatureTitle: string;
  claimsTitle: string;
  copyJson: string;
  copied: string;
  invalidStructure: string;
  decodeError: string;
  statusActive: string;
  statusExpired: string;
  expiresIn: string;
  expiredAgo: string;
  noExpiry: string;
  noClaims: string;
  signatureMissing: string;
  signaturePresent: string;
  issuer: string;
  subject: string;
  audience: string;
  expires: string;
  issuedAt: string;
  validFrom: string;
  durationUnits: {
    days: string;
    hours: string;
    minutes: string;
  };
};

type Props = {
  labels: Labels;
};

type DecodeResult =
  | { status: "idle" }
  | { status: "error"; message: string }
  | {
      status: "ready";
      header: Record<string, unknown>;
      payload: Record<string, unknown>;
      signature: string | null;
    };

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? 0 : 4 - (normalized.length % 4);
  return decodeBase64(normalized + "=".repeat(padding));
}

function decodeToken(raw: string, labels: Labels): DecodeResult {
  const token = raw.trim();
  if (!token) return { status: "idle" };
  const parts = token.split(".");
  if (parts.length < 2) {
    return { status: "error", message: labels.invalidStructure };
  }

  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const signature = parts[2] ?? null;
    return { status: "ready", header, payload, signature };
  } catch (error) {
    console.error("jwt decode failed", error);
    return { status: "error", message: labels.decodeError };
  }
}

function formatJson(value: Record<string, unknown>) {
  return JSON.stringify(value, null, 2);
}

function formatDuration(ms: number, labels: Labels) {
  const totalMinutes = Math.max(0, Math.round(ms / 60000));
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  const parts = [];
  if (days) parts.push(`${days}${labels.durationUnits.days}`);
  if (hours) parts.push(`${hours}${labels.durationUnits.hours}`);
  if (minutes || parts.length === 0) parts.push(`${minutes}${labels.durationUnits.minutes}`);
  return parts.join(" ");
}

function template(str: string, params: Record<string, string>) {
  return str.replace(/\{(\w+)\}/g, (_, key) => params[key] ?? "");
}

export function JwtInspectorTool({ labels }: Props) {
  const [value, setValue] = useState("");
  const [copiedField, setCopiedField] = useState<"header" | "payload" | null>(null);
  const [timestamp, setTimestamp] = useState(() => Date.now());

  const decoded = useMemo(() => decodeToken(value, labels), [value, labels]);

  const statusInfo = useMemo(() => {
    if (decoded.status !== "ready") {
      return null;
    }
    const payload = decoded.payload as Record<string, unknown>;
    const exp = typeof payload.exp === "number" ? payload.exp : Number(payload.exp);
    if (!Number.isFinite(exp)) {
      return { state: labels.statusActive, tone: "success" as const, detail: labels.noExpiry };
    }
    const expiryDate = new Date(exp * 1000);
    const now = timestamp;
    const expired = expiryDate.getTime() <= now;
    const duration = formatDuration(Math.abs(expiryDate.getTime() - now), labels);
    const detail = expired
      ? template(labels.expiredAgo, { duration })
      : template(labels.expiresIn, { duration });
    return {
      state: expired ? labels.statusExpired : labels.statusActive,
      tone: expired ? ("warning" as const) : ("success" as const),
      detail,
      expiryDate,
    };
  }, [decoded, labels, timestamp]);

  const claims = useMemo(() => {
    if (decoded.status !== "ready") return [];
    const payload = decoded.payload as Record<string, unknown>;
    const entries = [
      { label: labels.issuer, value: payload.iss },
      { label: labels.subject, value: payload.sub },
      { label: labels.audience, value: payload.aud },
      { label: labels.expires, value: payload.exp ? new Date(Number(payload.exp) * 1000).toISOString() : null },
      { label: labels.issuedAt, value: payload.iat ? new Date(Number(payload.iat) * 1000).toISOString() : null },
      { label: labels.validFrom, value: payload.nbf ? new Date(Number(payload.nbf) * 1000).toISOString() : null },
    ];
    return entries.filter((entry) => entry.value !== undefined && entry.value !== null && entry.value !== "");
  }, [decoded, labels]);

  const handleCopy = async (data: Record<string, unknown>, target: "header" | "payload") => {
    try {
      await navigator.clipboard.writeText(formatJson(data));
      setCopiedField(target);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error("copy failed", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">{labels.inputLabel}</label>
          <span className="text-xs text-muted-foreground">{labels.helper}</span>
        </div>
        <textarea
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setTimestamp(Date.now());
          }}
          placeholder={labels.placeholder}
          className="min-h-32 w-full rounded-lg border bg-background p-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {decoded.status === "error" ? (
        <div className="rounded-md border border-destructive/60 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {decoded.message}
        </div>
      ) : null}

      {decoded.status === "ready" ? (
        <div className="grid gap-4 md:grid-cols-2">
          {([
            { title: labels.headerTitle, data: decoded.header, key: "header" as const },
            { title: labels.payloadTitle, data: decoded.payload, key: "payload" as const },
          ]).map((section) => (
            <div key={section.key} className="space-y-2 rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
                <Button variant="outline" size="sm" onClick={() => handleCopy(section.data, section.key)}>
                  {copiedField === section.key ? labels.copied : labels.copyJson}
                </Button>
              </div>
              <pre className="min-h-32 whitespace-pre-wrap rounded-lg bg-muted/40 p-3 font-mono text-xs text-foreground">
                {formatJson(section.data)}
              </pre>
            </div>
          ))}
        </div>
      ) : null}

      {decoded.status === "ready" ? (
        <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-foreground">{labels.signatureTitle}</p>
              <p className="text-xs text-muted-foreground">
                {decoded.signature ? labels.signaturePresent : labels.signatureMissing}
              </p>
            </div>
            {statusInfo ? (
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  statusInfo.tone === "success"
                    ? "bg-emerald-100 text-emerald-900"
                    : "bg-amber-100 text-amber-900"
                }`}
              >
                {statusInfo.state}
              </span>
            ) : null}
          </div>
          {statusInfo ? (
            <p className="text-sm text-muted-foreground">{statusInfo.detail}</p>
          ) : null}
        </div>
      ) : null}

      {decoded.status === "ready" ? (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">{labels.claimsTitle}</h3>
          {claims.length === 0 ? (
            <p className="text-sm text-muted-foreground">{labels.noClaims}</p>
          ) : (
            <div className="divide-y rounded-xl border">
              {claims.map((claim) => (
                <div key={claim.label} className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="text-sm text-muted-foreground">{claim.label}</span>
                  <span className="text-sm font-medium text-foreground">
                    {typeof claim.value === "string" ? claim.value : String(claim.value)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
