export const UPCOMING_LUNAR_NEW_YEAR_DATES = [
  "2025-01-29",
  "2026-02-17",
  "2027-02-06",
  "2028-01-26",
  "2029-02-13",
];

export function getNextLunarNewYearDate(reference: Date, dates = UPCOMING_LUNAR_NEW_YEAR_DATES) {
  const todayMidnight = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());
  for (const iso of dates) {
    const candidate = new Date(`${iso}T00:00:00`);
    if (candidate >= todayMidnight) {
      return candidate;
    }
  }
  const fallback = dates.at(-1);
  return fallback ? new Date(`${fallback}T00:00:00`) : todayMidnight;
}

export function getDaysUntil(reference: Date, target: Date) {
  const start = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());
  const end = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const diffMs = end.getTime() - start.getTime();
  return Math.max(0, Math.round(diffMs / 86400000));
}

export function pickGreeting(greetings: string[], rng: () => number = Math.random) {
  const pool = greetings.length > 0 ? greetings : ["新年快乐！"];
  const index = Math.floor(rng() * pool.length);
  return pool[index] ?? pool[0];
}
