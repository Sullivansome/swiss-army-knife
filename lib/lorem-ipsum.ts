import { LoremIpsum } from "lorem-ipsum";

export type LoremWordsSource = {
  generateWords: (count: number) => string;
};

const defaultGenerator = new LoremIpsum({
  wordsPerSentence: {
    min: 4,
    max: 12,
  },
});

export function buildLoremParagraphs(
  words: string[],
  paragraphCount: number,
  wordsPerParagraph: number,
) {
  const paragraphs = Math.max(1, paragraphCount);
  const wordsPer = Math.max(1, wordsPerParagraph);
  const chunks: string[] = [];
  for (let i = 0; i < paragraphs; i += 1) {
    const start = i * wordsPer;
    const end = start + wordsPer;
    chunks.push(words.slice(start, end).join(" "));
  }
  return chunks.join("\n\n");
}

export function generateLoremIpsum(
  paragraphs: number,
  wordsPerParagraph: number,
  generator: LoremWordsSource = defaultGenerator,
) {
  const totalWords = Math.max(1, paragraphs * wordsPerParagraph);
  const allWords = generator.generateWords(totalWords).split(" ");
  return buildLoremParagraphs(allWords, paragraphs, wordsPerParagraph);
}
