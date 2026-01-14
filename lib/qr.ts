export const QR_DOWNLOAD_NAME = "qr-code.png";

export function normalizeQrSize(
  value: number,
  min = 100,
  max = 500,
  fallback = 200,
) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(Math.max(value, min), max);
}
