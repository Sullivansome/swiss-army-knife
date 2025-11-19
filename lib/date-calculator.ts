import { differenceInDays, differenceInMonths, differenceInWeeks } from "date-fns";

export type DateDiffStats = {
  days: number;
  weeks: number;
  months: number;
  isFuture: boolean;
};

function isValidDate(value: string) {
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp);
}

export function getDateDiffStats(start: string, end: string): DateDiffStats | null {
  if (!start || !end || !isValidDate(start) || !isValidDate(end)) {
    return null;
  }
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffDays = differenceInDays(endDate, startDate);
  const isFuture = diffDays >= 0;
  return {
    days: Math.abs(diffDays),
    weeks: Math.abs(differenceInWeeks(endDate, startDate)),
    months: Math.abs(differenceInMonths(endDate, startDate)),
    isFuture,
  };
}
