import { formatInTimeZone, getDatePartsForZone, getTimeZoneLabel } from "@/lib/timezones";

export type TimelineEntry = {
  id: string;
  zone: string;
  label: string;
  formatted: string;
  hour: number;
  workFriendly: boolean;
  isBase: boolean;
};

export type ParticipantZone = {
  id: string;
  zone: string;
  isBase: boolean;
};

export function buildTimeline(baseDate: Date, participants: ParticipantZone[], locale: string) {
  return participants.map((row) => {
    const label = getTimeZoneLabel(row.zone);
    const formatted = formatInTimeZone(baseDate, row.zone, locale);
    const parts = getDatePartsForZone(baseDate, row.zone);
    const hour = parts.hour;
    const workFriendly = hour >= 9 && hour < 18;
    return {
      id: row.id,
      zone: row.zone,
      label,
      formatted,
      hour,
      workFriendly,
      isBase: row.isBase,
    } satisfies TimelineEntry;
  });
}

export function buildTimelineSummary(entries: TimelineEntry[]) {
  return entries.map((entry) => `${entry.label}: ${entry.formatted}`).join("\n");
}
