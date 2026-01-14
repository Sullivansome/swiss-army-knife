const emojiRegex = /\p{Extended_Pictographic}|\p{Emoji_Presentation}/gu;

export function extractEmojis(input: string) {
  return input.match(emojiRegex) ?? [];
}

export function removeEmojis(input: string) {
  return input.replace(emojiRegex, "");
}
