export type SummaryStats = {
  count: number;
  sum: number;
  mean: number;
  median: number;
  min: number;
  max: number;
  variance: number;
  stddev: number;
};

export function parseNumberList(input: string) {
  const tokens = input.split(/[,\s]+/).filter(Boolean);
  const values: number[] = [];
  let invalid = 0;
  for (const token of tokens) {
    const value = Number(token);
    if (Number.isFinite(value)) {
      values.push(value);
    } else {
      invalid += 1;
    }
  }
  return { values, invalid };
}

export function computeSummaryStats(values: number[]): SummaryStats | null {
  if (!values.length) {
    return null;
  }
  const count = values.length;
  const sum = values.reduce((acc, value) => acc + value, 0);
  const mean = sum / count;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(count / 2);
  const median =
    count % 2 === 0
      ? (sorted[middle - 1] + sorted[middle]) / 2
      : sorted[middle];
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const variance =
    values.reduce((acc, value) => acc + (value - mean) ** 2, 0) / count;
  const stddev = Math.sqrt(variance);
  return { count, sum, mean, median, min, max, variance, stddev };
}
