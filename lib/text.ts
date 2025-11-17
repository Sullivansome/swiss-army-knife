import { diffLines, type Change } from "diff";

export type TextStats = {
  characters: number;
  words: number;
  lines: number;
};

export type CaseStyle = "upper" | "lower" | "camel" | "snake" | "kebab" | "title";

export type DiffResult = Change[];

export function getTextStats(text: string): TextStats {
  const characters = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text.length ? text.split(/\r?\n/).length : 0;
  return { characters, words, lines };
}

export function convertCase(text: string, style: CaseStyle): string {
  switch (style) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "camel":
      return toCamel(text);
    case "snake":
      return toDelimited(text, "_");
    case "kebab":
      return toDelimited(text, "-");
    case "title":
      return toTitle(text);
    default:
      return text;
  }
}

export function buildDiff(left: string, right: string): DiffResult {
  return diffLines(left, right);
}

function tokenize(text: string) {
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.toLowerCase());
}

function toCamel(text: string) {
  const parts = tokenize(text);
  if (!parts.length) return "";
  return parts[0] + parts.slice(1).map(capitalize).join("");
}

function toDelimited(text: string, delimiter: "_" | "-") {
  const parts = tokenize(text);
  return parts.join(delimiter);
}

function toTitle(text: string) {
  const parts = tokenize(text);
  return parts.map(capitalize).join(" ");
}

function capitalize(part: string) {
  return part ? part[0].toUpperCase() + part.slice(1) : "";
}
