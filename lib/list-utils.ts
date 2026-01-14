export type SortMode = "none" | "asc" | "desc";

export function processList(
  input: string,
  caseSensitive: boolean,
  sortMode: SortMode,
): string[] {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const seen = new Set<string>();
  const result: string[] = [];

  for (const line of lines) {
    const key = caseSensitive ? line : line.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(line);
    }
  }

  if (sortMode === "asc") {
    result.sort((a, b) => a.localeCompare(b));
  } else if (sortMode === "desc") {
    result.sort((a, b) => b.localeCompare(a));
  }

  return result;
}
