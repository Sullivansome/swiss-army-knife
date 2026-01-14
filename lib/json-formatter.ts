export type JsonFormatStatus = "empty" | "valid" | "invalid";

export type JsonFormatResult = {
  status: JsonFormatStatus;
  formatted?: string;
  error?: string;
};

function extractPosition(message: string) {
  const match = message.match(/position\s+(\d+)/i);
  if (!match) return null;
  const pos = Number(match[1]);
  if (!Number.isFinite(pos) || pos < 0) return null;
  return pos;
}

export function formatJsonErrorMessage(
  message: string,
  input: string,
  fallback: string,
) {
  const pos = extractPosition(message);
  if (pos === null) return fallback;
  const snippet = input.slice(0, pos);
  const lines = snippet.split(/\r\n|\r|\n/);
  const line = lines.length;
  const column = (lines[lines.length - 1]?.length ?? 0) + 1;
  return `${fallback} (line ${line}, column ${column})`;
}

export function formatJsonInput(
  input: string,
  fallbackError: string,
): JsonFormatResult {
  if (!input.trim()) {
    return { status: "empty" };
  }
  try {
    const parsed = JSON.parse(input);
    return { status: "valid", formatted: JSON.stringify(parsed, null, 2) };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      status: "invalid",
      error: formatJsonErrorMessage(message, input, fallbackError),
    };
  }
}

export function validateJsonInput(
  input: string,
  fallbackError: string,
): JsonFormatResult {
  if (!input.trim()) {
    return { status: "empty" };
  }
  try {
    JSON.parse(input);
    return { status: "valid" };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      status: "invalid",
      error: formatJsonErrorMessage(message, input, fallbackError),
    };
  }
}
