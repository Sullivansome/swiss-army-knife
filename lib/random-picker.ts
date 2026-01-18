export interface Entry {
  id: string;
  label: string;
  weight?: number;
}

export interface SpinResult {
  at: number;
  entry: Entry;
}

export interface PickConfig {
  count: number;
  allowDuplicates: boolean;
  removeWinners: boolean;
}

export function secureRandomInt(max: number): number {
  if (max <= 0) return 0;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

export function secureRandomFloat(): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] / (0xffffffff + 1);
}

export function parseEntries(input: string): Entry[] {
  return input
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((label, index) => ({
      id: `entry-${index}-${Date.now()}`,
      label,
    }));
}

export function generateNumberRange(
  start: number,
  end: number,
  step: number = 1,
): Entry[] {
  const entries: Entry[] = [];
  const actualStep = step > 0 ? step : 1;

  if (start <= end) {
    for (let i = start; i <= end; i += actualStep) {
      entries.push({ id: `num-${i}`, label: String(i) });
    }
  } else {
    for (let i = start; i >= end; i -= actualStep) {
      entries.push({ id: `num-${i}`, label: String(i) });
    }
  }

  return entries;
}

export function createPresetEntries(
  preset: "yesno" | "coin" | "d6" | "d20",
): Entry[] {
  switch (preset) {
    case "yesno":
      return [
        { id: "yes", label: "Yes" },
        { id: "no", label: "No" },
      ];
    case "coin":
      return [
        { id: "heads", label: "Heads" },
        { id: "tails", label: "Tails" },
      ];
    case "d6":
      return Array.from({ length: 6 }, (_, i) => ({
        id: `d6-${i + 1}`,
        label: String(i + 1),
      }));
    case "d20":
      return Array.from({ length: 20 }, (_, i) => ({
        id: `d20-${i + 1}`,
        label: String(i + 1),
      }));
    default:
      return [];
  }
}

export function shuffleEntries(entries: Entry[]): Entry[] {
  const shuffled = [...entries];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function pickOne(entries: Entry[]): Entry | null {
  if (entries.length === 0) return null;
  const index = secureRandomInt(entries.length);
  return entries[index];
}

export function pickMany(
  entries: Entry[],
  count: number,
  allowDuplicates: boolean = false,
): Entry[] {
  if (entries.length === 0) return [];

  const pickCount = Math.min(count, allowDuplicates ? count : entries.length);
  const results: Entry[] = [];

  if (allowDuplicates) {
    for (let i = 0; i < pickCount; i++) {
      const index = secureRandomInt(entries.length);
      results.push(entries[index]);
    }
  } else {
    const shuffled = shuffleEntries(entries);
    results.push(...shuffled.slice(0, pickCount));
  }

  return results;
}

export function pickWinners(
  entries: string[],
  count: number,
  _rng: () => number = secureRandomFloat,
): string[] {
  if (!entries.length) return [];
  const entryObjects = entries.map((label, i) => ({
    id: `legacy-${i}`,
    label,
  }));
  const winners = pickMany(entryObjects, count, false);
  return winners.map((w) => w.label);
}

export function buildGroups(
  entries: string[],
  groupSize: number,
  _rng: () => number = secureRandomFloat,
): string[][] {
  if (!entries.length) return [];
  const size = Math.max(2, groupSize);
  const entryObjects = entries.map((label, i) => ({
    id: `legacy-${i}`,
    label,
  }));
  const shuffled = shuffleEntries(entryObjects);
  const buckets: string[][] = [];
  for (let i = 0; i < shuffled.length; i += size) {
    buckets.push(shuffled.slice(i, i + size).map((e) => e.label));
  }
  return buckets;
}

export function calculateWheelRotation(
  winnerIndex: number,
  totalEntries: number,
  extraSpins: number = 5,
): number {
  if (totalEntries === 0) return 0;

  const segmentAngle = 360 / totalEntries;
  const targetAngle = segmentAngle * winnerIndex + segmentAngle / 2;
  const fullRotations = extraSpins * 360;
  return fullRotations + (360 - targetAngle);
}

export function generateWheelColors(count: number): string[] {
  const baseColors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
    "#F8B500",
    "#00CED1",
    "#FF69B4",
    "#32CD32",
    "#FF8C00",
  ];

  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  return colors;
}

const STORAGE_KEY = "random-picker-state";
const STORAGE_VERSION = 1;

export interface PersistedState {
  version: number;
  entriesText: string;
  history: SpinResult[];
  lastMode: "names" | "numbers" | "quick";
}

export function saveState(state: Partial<PersistedState>): void {
  try {
    const existing = loadState();
    const merged: PersistedState = {
      version: STORAGE_VERSION,
      entriesText: state.entriesText ?? existing?.entriesText ?? "",
      history: state.history ?? existing?.history ?? [],
      lastMode: state.lastMode ?? existing?.lastMode ?? "names",
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // localStorage unavailable in SSR or private browsing
  }
}

export function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== STORAGE_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearHistory(): void {
  saveState({ history: [] });
}
