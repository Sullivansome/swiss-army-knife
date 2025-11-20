const WEEKDAY_INDEX: Record<string, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

const COMMON_TIMEZONES = [
  "UTC",
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "Europe/Moscow",
  "Africa/Johannesburg",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
];

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(timeZone: string) {
  if (!formatterCache.has(timeZone)) {
    try {
      formatterCache.set(
        timeZone,
        new Intl.DateTimeFormat("en-US", {
          timeZone,
          hour12: false,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          weekday: "short",
        }),
      );
    } catch (error) {
      console.error("Invalid time zone", timeZone, error);
      formatterCache.set(
        timeZone,
        new Intl.DateTimeFormat("en-US", {
          timeZone: "UTC",
          hour12: false,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          weekday: "short",
        }),
      );
    }
  }
  return formatterCache.get(timeZone)!;
}

function getParts(date: Date, timeZone: string) {
  const formatter = getFormatter(timeZone);
  return formatter.formatToParts(date);
}

function partValue(parts: Intl.DateTimeFormatPart[], type: string) {
  return parts.find((part) => part.type === type)?.value ?? "0";
}

export function getTimeZoneOffset(date: Date, timeZone: string) {
  const parts = getParts(date, timeZone);
  const asUTC = Date.UTC(
    Number(partValue(parts, "year")),
    Number(partValue(parts, "month")) - 1,
    Number(partValue(parts, "day")),
    Number(partValue(parts, "hour")),
    Number(partValue(parts, "minute")),
    Number(partValue(parts, "second")),
  );
  return Math.round((asUTC - date.getTime()) / 60000);
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function formatOffset(offsetMinutes: number) {
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absolute = Math.abs(offsetMinutes);
  const hours = Math.floor(absolute / 60);
  const minutes = absolute % 60;
  return `GMT${sign}${pad(hours)}:${pad(minutes)}`;
}

export function getTimeZoneLabel(timeZone: string, referenceDate = new Date()) {
  const offset = getTimeZoneOffset(referenceDate, timeZone);
  return `${timeZone} (${formatOffset(offset)})`;
}

export function getAvailableTimezones() {
  if (typeof Intl.supportedValuesOf === "function") {
    try {
      return Intl.supportedValuesOf("timeZone");
    } catch (error) {
      console.warn("Intl.supportedValuesOf timeZone failed", error);
    }
  }
  return COMMON_TIMEZONES;
}

export function getDatePartsForZone(date: Date, timeZone: string) {
  const parts = getParts(date, timeZone);
  const weekdayRaw = partValue(parts, "weekday").toLowerCase();
  return {
    year: Number(partValue(parts, "year")),
    month: Number(partValue(parts, "month")),
    day: Number(partValue(parts, "day")),
    hour: Number(partValue(parts, "hour")),
    minute: Number(partValue(parts, "minute")),
    second: Number(partValue(parts, "second")),
    weekday: WEEKDAY_INDEX[weekdayRaw as keyof typeof WEEKDAY_INDEX] ?? 0,
  };
}

type DateFields = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

function zonedTimeToUtc(fields: DateFields, timeZone: string) {
  const utcGuess = Date.UTC(fields.year, fields.month - 1, fields.day, fields.hour, fields.minute, 0);
  const guessDate = new Date(utcGuess);
  const offset = getTimeZoneOffset(guessDate, timeZone);
  return new Date(utcGuess - offset * 60000);
}

export function parseDateTimeLocal(value: string, timeZone: string) {
  if (!value) return null;
  if (!value.includes("T")) return null;
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map((segment) => Number(segment));
  const [hour, minute] = timePart.split(":").map((segment) => Number(segment));
  if ([year, month, day, hour, minute].some((part) => Number.isNaN(part))) {
    return null;
  }
  return zonedTimeToUtc({ year, month, day, hour, minute }, timeZone);
}

export function formatDateTimeLocal(date: Date, timeZone: string) {
  const parts = getDatePartsForZone(date, timeZone);
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}`;
}

export function formatInTimeZone(date: Date, timeZone: string, locale?: string) {
  const formatter = new Intl.DateTimeFormat(locale ?? "en-US", {
    timeZone,
    dateStyle: "medium",
    timeStyle: "short",
  });
  return formatter.format(date);
}
