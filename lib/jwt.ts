import { decodeBase64 } from "@/lib/base64";

export type JwtDecodeResult =
  | { status: "idle" }
  | { status: "error"; message: string }
  | {
      status: "ready";
      header: Record<string, unknown>;
      payload: Record<string, unknown>;
      signature: string | null;
    };

export function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? 0 : 4 - (normalized.length % 4);
  return decodeBase64(normalized + "=".repeat(padding));
}

export function decodeJwtToken(raw: string, invalidMessage: string, decodeError: string): JwtDecodeResult {
  const token = raw.trim();
  if (!token) return { status: "idle" };
  const parts = token.split(".");
  if (parts.length < 2) {
    return { status: "error", message: invalidMessage };
  }

  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const signature = parts[2] ?? null;
    return { status: "ready", header, payload, signature };
  } catch (error) {
    console.error("jwt decode failed", error);
    return { status: "error", message: decodeError };
  }
}

export function formatJwtJson(value: Record<string, unknown>) {
  return JSON.stringify(value, null, 2);
}

export function formatDuration(ms: number, labels: { durationUnits: { days: string; hours: string; minutes: string } }) {
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

export function template(str: string, params: Record<string, string>) {
  return str.replace(/\{(\w+)\}/g, (_, key) => params[key] ?? "");
}
