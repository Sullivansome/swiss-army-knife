export type FitResult = {
  width: number;
  height: number;
  x: number;
  y: number;
  ratio: number;
};

export function moveItem<T>(items: T[], index: number, direction: number) {
  const next = [...items];
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function removeItem<T>(items: T[], index: number) {
  return items.filter((_, idx) => idx !== index);
}

export function fitImageToPage(
  imageWidth: number,
  imageHeight: number,
  pageWidth: number,
  pageHeight: number,
): FitResult {
  const ratio = Math.min(pageWidth / imageWidth, pageHeight / imageHeight);
  const width = imageWidth * ratio;
  const height = imageHeight * ratio;
  const x = (pageWidth - width) / 2;
  const y = (pageHeight - height) / 2;
  return { width, height, x, y, ratio };
}
