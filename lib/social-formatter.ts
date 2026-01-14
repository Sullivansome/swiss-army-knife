export type SocialFormatOptions = {
  emoji: string;
  useBullets: boolean;
  insertSpacing: boolean;
};

export function formatSocialText(input: string, options: SocialFormatOptions) {
  const trimmedEmoji = options.emoji.trim();
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      let next = line;
      if (trimmedEmoji) {
        next = `${trimmedEmoji} ${next}`;
      }
      if (options.useBullets) {
        next = `• ${next}`;
      }
      return next;
    });
  const joiner = options.insertSpacing ? "\n\n" : "\n";
  return lines.join(joiner);
}
