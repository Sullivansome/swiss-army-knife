export type AdvancedWordStats = {
  charsWithSpaces: number;
  charsWithoutSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
};

export function computeAdvancedWordStats(text: string): AdvancedWordStats {
  const trimmed = text.trim();
  const charsWithSpaces = text.length;
  const charsWithoutSpaces = text.replace(/\s+/g, "").length;
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const sentences = trimmed
    ? trimmed.split(/[.!?\u3002\uff01\uff1f]+/).filter(Boolean).length
    : 0;
  const paragraphs = trimmed
    ? trimmed.split(/\n\s*\n/).filter(Boolean).length
    : 0;
  return { charsWithSpaces, charsWithoutSpaces, words, sentences, paragraphs };
}
