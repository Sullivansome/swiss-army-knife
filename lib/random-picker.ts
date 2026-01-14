export function parseEntries(input: string) {
  return input
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function shuffleEntries(entries: string[], rng: () => number = Math.random) {
  const next = [...entries];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function pickWinners(entries: string[], count: number, rng: () => number = Math.random) {
  if (!entries.length) return [];
  const shuffled = shuffleEntries(entries, rng);
  const winnerCount = Math.min(Math.max(1, count), shuffled.length);
  return shuffled.slice(0, winnerCount);
}

export function buildGroups(entries: string[], groupSize: number, rng: () => number = Math.random) {
  if (!entries.length) return [] as string[][];
  const size = Math.max(2, groupSize);
  const shuffled = shuffleEntries(entries, rng);
  const buckets: string[][] = [];
  for (let i = 0; i < shuffled.length; i += size) {
    buckets.push(shuffled.slice(i, i + size));
  }
  return buckets;
}
