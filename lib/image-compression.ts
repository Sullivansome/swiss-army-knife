export function computeTargetSizeMB(
  originalBytes: number,
  quality: number,
  minSize = 0.2,
) {
  const sizeMb = originalBytes / (1024 * 1024);
  return Math.max(sizeMb * quality, minSize);
}

export function formatFileSize(bytes: number) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function formatCompressionRatio(
  originalBytes: number,
  compressedBytes: number,
) {
  if (!originalBytes) return "0.0%";
  return `${((compressedBytes / originalBytes) * 100).toFixed(1)}%`;
}
