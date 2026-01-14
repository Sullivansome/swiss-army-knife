export function formatExifDate(value?: string | Date) {
  if (!value) return "--";
  if (value instanceof Date) return value.toISOString();
  return value;
}
