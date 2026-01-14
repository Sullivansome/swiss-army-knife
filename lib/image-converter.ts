export function getImageMime(format: string) {
  const normalized = format.toLowerCase();
  if (normalized === "jpg" || normalized === "jpeg") return "image/jpeg";
  if (normalized === "png") return "image/png";
  if (normalized === "webp") return "image/webp";
  return `image/${normalized}`;
}

export function buildConvertedFilename(originalName: string, format: string) {
  const normalized = format.toLowerCase();
  return originalName.replace(/\.[^.]+$/, `.${normalized}`);
}
