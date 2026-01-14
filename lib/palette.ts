export function randomColor(rng: () => number = Math.random) {
  return `#${Math.floor(rng() * 0xffffff)
    .toString(16)
    .padStart(6, "0")}`.toUpperCase();
}

export function generatePalette(count = 5, rng: () => number = Math.random) {
  return Array.from({ length: count }, () => randomColor(rng));
}
