export type RGB = { r: number; g: number; b: number };

export function parseHex(color: string): RGB | null {
  const normalized = color.trim().replace("#", "");
  if (![3, 6].includes(normalized.length)) return null;
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;
  const value = Number.parseInt(full, 16);
  if (Number.isNaN(value)) return null;
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

export function luminance({ r, g, b }: RGB) {
  const channel = (component: number) => {
    const value = component / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function getContrastRatio(foreground: string, background: string) {
  const fg = parseHex(foreground);
  const bg = parseHex(background);
  if (!fg || !bg) return null;
  const lum1 = luminance(fg) + 0.05;
  const lum2 = luminance(bg) + 0.05;
  const ratio = lum1 > lum2 ? lum1 / lum2 : lum2 / lum1;
  return Number.isFinite(ratio) ? ratio : null;
}

export function formatContrastRatio(value: number | null) {
  if (!value) return "–";
  return `${value.toFixed(2)}:1`;
}
