export type MatchResult = {
  text: string;
  index: number;
  groups: string[];
  named?: Record<string, string | undefined>;
};

export type HighlightSegment = {
  text: string;
  match: boolean;
};

export function buildRegex(pattern: string, flags: string) {
  if (!pattern) return null;
  try {
    return new RegExp(pattern, flags);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("regex build failed", error);
    }
    return null;
  }
}

export function analyzeRegexMatches(
  pattern: string,
  flags: string,
  sample: string,
) {
  if (!pattern) {
    return {
      matches: [] as MatchResult[],
      segments: [{ text: sample, match: false }] as HighlightSegment[],
      hasError: false,
    };
  }

  const regex = buildRegex(pattern, flags);
  if (!regex) {
    return {
      matches: [] as MatchResult[],
      segments: [{ text: sample, match: false }] as HighlightSegment[],
      hasError: true,
    };
  }

  const globalFlags = regex.flags.includes("g")
    ? regex.flags
    : `${regex.flags}g`;
  const matcher = buildRegex(regex.source, globalFlags);
  if (!matcher) {
    return {
      matches: [] as MatchResult[],
      segments: [{ text: sample, match: false }] as HighlightSegment[],
      hasError: true,
    };
  }

  const results: MatchResult[] = [];
  const fragments: HighlightSegment[] = [];
  let cursor = 0;

  const stopAfterFirst = !regex.flags.includes("g");

  for (const entry of sample.matchAll(matcher)) {
    if (!entry[0]) continue;
    const index = entry.index ?? 0;
    if (index > cursor) {
      fragments.push({ text: sample.slice(cursor, index), match: false });
    }
    const chunk = entry[0];
    fragments.push({ text: chunk, match: true });
    cursor = index + chunk.length;
    results.push({
      text: chunk,
      index,
      groups: entry.slice(1),
      named: entry.groups ?? undefined,
    });
    if (stopAfterFirst) {
      break;
    }
  }

  if (cursor < sample.length) {
    fragments.push({ text: sample.slice(cursor), match: false });
  }

  return { matches: results, segments: fragments, hasError: false };
}
