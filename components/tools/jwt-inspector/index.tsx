"use client";

import {
  AlertCircle,
  Calendar,
  Key,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { StudioPanel } from "@/components/ui/studio/studio-panel";
import { StudioToolbar } from "@/components/ui/studio/studio-toolbar";
import { ToolStudio } from "@/components/ui/studio/tool-studio";
import { WidgetCard } from "@/components/ui/widget-card";
import {
  decodeJwtToken,
  formatDuration,
  formatJwtJson,
  template,
} from "@/lib/jwt";
import { cn } from "@/lib/utils";

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

export function JwtInspectorTool({ labels }: Props) {
  const [value, setValue] = useState("");
  const [timestamp, setTimestamp] = useState(() => Date.now());

  const decoded = useMemo(
    () => decodeJwtToken(value, labels.invalidStructure, labels.decodeError),
    [value, labels],
  );

  const statusInfo = useMemo(() => {
    if (decoded.status !== "ready") {
      return null;
    }
    const payload = decoded.payload as Record<string, unknown>;
    const exp =
      typeof payload.exp === "number" ? payload.exp : Number(payload.exp);
    if (!Number.isFinite(exp)) {
      return {
        state: labels.statusActive,
        tone: "success" as const,
        detail: labels.noExpiry,
      };
    }
    const expiryDate = new Date(exp * 1000);
    const now = timestamp;
    const expired = expiryDate.getTime() <= now;
    const duration = formatDuration(
      Math.abs(expiryDate.getTime() - now),
      labels,
    );
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
      { label: labels.issuer, value: payload.iss, icon: ShieldCheck },
      { label: labels.subject, value: payload.sub, icon: User },
      { label: labels.audience, value: payload.aud, icon: Key },
      {
        label: labels.expires,
        value: payload.exp
          ? new Date(Number(payload.exp) * 1000).toISOString()
          : null,
        icon: Calendar,
      },
      {
        label: labels.issuedAt,
        value: payload.iat
          ? new Date(Number(payload.iat) * 1000).toISOString()
          : null,
        icon: Calendar,
      },
      {
        label: labels.validFrom,
        value: payload.nbf
          ? new Date(Number(payload.nbf) * 1000).toISOString()
          : null,
        icon: Calendar,
      },
    ];
    return entries.filter(
      (entry) =>
        entry.value !== undefined && entry.value !== null && entry.value !== "",
    );
  }, [decoded, labels]);

  return (
    <div className="flex flex-col">
      <StudioToolbar>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setValue("");
            setTimestamp(Date.now());
          }}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </StudioToolbar>

      <div className="space-y-6">
        <StudioPanel
          title={labels.inputLabel}
          actions={<CopyButton value={value} size="icon-sm" variant="ghost" />}
        >
          <textarea
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setTimestamp(Date.now());
            }}
            placeholder={labels.placeholder}
            className="h-[150px] w-full resize-none rounded-md bg-transparent p-4 font-mono text-sm focus:outline-none"
          />
        </StudioPanel>

        {decoded.status === "error" && (
          <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="h-5 w-5" />
            {decoded.message}
          </div>
        )}

        {decoded.status === "ready" && (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              <StudioPanel
                title={labels.headerTitle}
                actions={
                  <CopyButton
                    value={formatJwtJson(decoded.header)}
                    label={labels.copyJson}
                  />
                }
                className="bg-muted/5"
              >
                <pre className="h-[300px] w-full overflow-auto rounded-md bg-transparent p-4 font-mono text-xs text-muted-foreground">
                  {formatJwtJson(decoded.header)}
                </pre>
              </StudioPanel>

              <StudioPanel
                title={labels.payloadTitle}
                actions={
                  <CopyButton
                    value={formatJwtJson(decoded.payload)}
                    label={labels.copyJson}
                  />
                }
                className="bg-muted/5"
              >
                <pre className="h-[300px] w-full overflow-auto rounded-md bg-transparent p-4 font-mono text-xs text-muted-foreground">
                  {formatJwtJson(decoded.payload)}
                </pre>
              </StudioPanel>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <WidgetCard title="Verification Status" className="h-full">
                <div className="space-y-6">
                  <div className="flex items-center justify-between rounded-lg border bg-card p-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        {labels.signatureTitle}
                      </p>
                      <div className="flex items-center gap-2">
                        {decoded.signature ? (
                          <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <ShieldAlert className="h-4 w-4 text-amber-500" />
                        )}
                        <span className="font-medium text-foreground">
                          {decoded.signature
                            ? labels.signaturePresent
                            : labels.signatureMissing}
                        </span>
                      </div>
                    </div>
                  </div>

                  {statusInfo && (
                    <div
                      className={cn(
                        "rounded-lg border p-4 space-y-1",
                        statusInfo.tone === "success"
                          ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-900/10"
                          : "border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-900/10",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            statusInfo.tone === "success"
                              ? "bg-emerald-500"
                              : "bg-amber-500",
                          )}
                        />
                        <span className="font-semibold text-foreground">
                          {statusInfo.state}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground pl-4">
                        {statusInfo.detail}
                      </p>
                    </div>
                  )}
                </div>
              </WidgetCard>

              <WidgetCard title={labels.claimsTitle} className="h-full">
                {claims.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {labels.noClaims}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {claims.map((claim) => (
                      <div
                        key={claim.label}
                        className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3"
                      >
                        <div className="mt-0.5 rounded-md bg-background p-1.5 shadow-sm">
                          <claim.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {claim.label}
                          </p>
                          <p
                            className="text-sm font-medium text-foreground truncate"
                            title={String(claim.value)}
                          >
                            {typeof claim.value === "string"
                              ? claim.value
                              : String(claim.value)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </WidgetCard>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default JwtInspectorTool;
