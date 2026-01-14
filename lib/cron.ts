import { getDatePartsForZone } from "./timezones";

export type CronSegment =
  | { type: "any" }
  | { type: "value"; value: number }
  | { type: "range"; start: number; end: number; step: number };

export type CronField = {
  any: boolean;
  values: Set<number>;
  segments: CronSegment[];
};

export type CronSchedule = {
  minute: CronField;
  hour: CronField;
  dayOfMonth: CronField;
  month: CronField;
  dayOfWeek: CronField;
};

type FieldType = keyof CronSchedule;

const RANGE_LIMITS: Record<FieldType, [number, number]> = {
  minute: [0, 59],
  hour: [0, 23],
  dayOfMonth: [1, 31],
  month: [1, 12],
  dayOfWeek: [0, 6],
};

const MONTH_NAMES: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

const WEEK_NAMES: Record<string, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

function normalizeDayOfWeek(value: number) {
  if (value === 7) return 0;
  return value;
}

function parseToken(value: string, type: FieldType) {
  const cleaned = value.toLowerCase();
  if (type === "month" && MONTH_NAMES[cleaned] !== undefined) {
    return MONTH_NAMES[cleaned];
  }
  if (type === "dayOfWeek" && WEEK_NAMES[cleaned] !== undefined) {
    return WEEK_NAMES[cleaned];
  }
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid value "${value}" in cron field.`);
  }
  if (type === "dayOfWeek") {
    return normalizeDayOfWeek(parsed);
  }
  return parsed;
}

function expandSegment(
  segment: string,
  type: FieldType,
  [min, max]: [number, number],
) {
  const trimmed = segment.trim();
  if (!trimmed) {
    throw new Error("Empty segment in cron field.");
  }
  if (trimmed === "*" || trimmed === "?") {
    return { token: { type: "any" as const }, values: new Set<number>() };
  }

  const [rangePartRaw, stepPart] = trimmed.split("/");
  const rangePart =
    rangePartRaw === "*" || rangePartRaw === "?"
      ? `${min}-${max}`
      : rangePartRaw;
  const step = stepPart ? Number(stepPart) : 1;
  if (Number.isNaN(step) || step <= 0) {
    throw new Error(`Invalid step value "${stepPart}" in cron field.`);
  }

  const [startRaw, endRaw] = rangePart.includes("-")
    ? rangePart.split("-")
    : [rangePart, rangePart];
  const start = parseToken(startRaw, type);
  const end = parseToken(endRaw, type);

  if (start < min || start > max || end < min || end > max) {
    throw new Error(`Value out of range in cron field: ${segment}`);
  }
  if (start > end) {
    throw new Error(
      `Range start must be less than or equal to end in cron field: ${segment}`,
    );
  }
  const normalizedStart = start;
  const normalizedEnd = end;

  const values = new Set<number>();
  for (
    let current = normalizedStart;
    current <= normalizedEnd;
    current += step
  ) {
    const value = type === "dayOfWeek" ? normalizeDayOfWeek(current) : current;
    values.add(value);
  }

  const token: CronSegment =
    normalizedStart === normalizedEnd && step === 1
      ? { type: "value", value: normalizedStart }
      : { type: "range", start: normalizedStart, end: normalizedEnd, step };

  return {
    token,
    values,
  };
}

function mergeFieldData(fieldParts: string[], type: FieldType) {
  const [min, max] = RANGE_LIMITS[type];
  const values = new Set<number>();
  const segments: CronSegment[] = [];
  for (const part of fieldParts) {
    const expanded = expandSegment(part, type, [min, max]);
    if (expanded.token.type === "any") {
      return {
        any: true,
        values: new Set<number>(),
        segments: [{ type: "any" as const }],
      };
    }
    segments.push(expanded.token);
    expanded.values.forEach((value) => values.add(value));
  }
  return { any: false, values, segments };
}

function parseField(field: string, type: FieldType) {
  const trimmed = field.trim();
  if (!trimmed || trimmed === "*" || trimmed === "?") {
    return {
      any: true,
      values: new Set<number>(),
      segments: [{ type: "any" as const }],
    };
  }
  const parts = trimmed.split(",");
  return mergeFieldData(parts, type);
}

export function parseCronExpression(expression: string): CronSchedule {
  const cleaned = expression.trim().replace(/\s+/g, " ");
  if (!cleaned) {
    throw new Error("Cron expression cannot be empty.");
  }
  const parts = cleaned.split(" ");
  if (parts.length !== 5) {
    throw new Error("Cron expression must have 5 fields.");
  }

  return {
    minute: parseField(parts[0], "minute"),
    hour: parseField(parts[1], "hour"),
    dayOfMonth: parseField(parts[2], "dayOfMonth"),
    month: parseField(parts[3], "month"),
    dayOfWeek: parseField(parts[4], "dayOfWeek"),
  };
}

function matchesField(value: number, field: CronField) {
  return field.any || field.values.has(value);
}

function matchesDay(
  dateParts: ReturnType<typeof getDatePartsForZone>,
  schedule: CronSchedule,
) {
  const domAny = schedule.dayOfMonth.any;
  const dowAny = schedule.dayOfWeek.any;
  const domMatch = matchesField(dateParts.day, schedule.dayOfMonth);
  const dowMatch = matchesField(dateParts.weekday, schedule.dayOfWeek);
  if (domAny && dowAny) return true;
  if (domAny) return dowMatch;
  if (dowAny) return domMatch;
  return domMatch || dowMatch;
}

function matchesSchedule(date: Date, schedule: CronSchedule, timeZone: string) {
  const parts = getDatePartsForZone(date, timeZone);
  return (
    matchesField(parts.minute, schedule.minute) &&
    matchesField(parts.hour, schedule.hour) &&
    matchesDay(parts, schedule) &&
    matchesField(parts.month, schedule.month)
  );
}

type NextRunOptions = {
  count: number;
  timeZone: string;
  startDate?: Date;
};

export function getNextRuns(schedule: CronSchedule, options: NextRunOptions) {
  const { count, timeZone, startDate } = options;
  const runs: Date[] = [];
  let cursor = new Date(startDate ?? new Date());
  cursor.setSeconds(0, 0);
  let safety = 0;
  const limit = 600000;
  while (runs.length < count && safety < limit) {
    cursor = new Date(cursor.getTime() + 60_000);
    if (matchesSchedule(cursor, schedule, timeZone)) {
      runs.push(new Date(cursor));
    }
    safety += 1;
  }
  return runs;
}
