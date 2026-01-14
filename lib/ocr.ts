export function formatOcrProgress(label: string, progress: number) {
  return `${label} ${Math.round(progress * 100)}%`;
}

export function shouldResetWorker(currentLang: string, nextLang: string) {
  return currentLang !== nextLang;
}
