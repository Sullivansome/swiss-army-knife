import { toPng, toSvg } from "html-to-image";
import katex from "katex";

// Example equations for users to try
export const LATEX_EXAMPLES = [
  {
    name: "Quadratic Formula",
    latex: "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}",
  },
  {
    name: "Euler's Identity",
    latex: "e^{i\\pi} + 1 = 0",
  },
  {
    name: "Integral",
    latex: "\\int_{-1}^{1} \\sqrt{1-x^2}\\ dx = \\frac{\\pi}{2}",
  },
  {
    name: "Summation",
    latex: "\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}",
  },
  {
    name: "Matrix",
    latex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}",
  },
  {
    name: "Limit",
    latex: "\\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^x = e",
  },
  {
    name: "Derivative",
    latex: "\\frac{d}{dx} \\left[ \\int_{a}^{x} f(t)\\,dt \\right] = f(x)",
  },
  {
    name: "Binomial",
    latex: "(x+y)^n = \\sum_{k=0}^{n} \\binom{n}{k} x^{n-k} y^k",
  },
] as const;

export const DEFAULT_LATEX = LATEX_EXAMPLES[0].latex;

// Scale options for export
export const SCALE_OPTIONS = [
  { label: "100%", value: 1 },
  { label: "150%", value: 1.5 },
  { label: "200%", value: 2 },
  { label: "300%", value: 3 },
  { label: "500%", value: 5 },
] as const;

export type RenderResult =
  | { success: true; html: string }
  | { success: false; error: string };

/**
 * Render LaTeX to HTML string using KaTeX
 */
export function renderLatex(
  latex: string,
  options?: { displayMode?: boolean; color?: string },
): RenderResult {
  if (!latex.trim()) {
    return { success: false, error: "Empty input" };
  }

  try {
    const html = katex.renderToString(latex, {
      throwOnError: true,
      displayMode: options?.displayMode ?? true,
      output: "htmlAndMathml",
      trust: false,
      strict: "warn",
    });

    return { success: true, html };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to render LaTeX";
    return { success: false, error: message };
  }
}

/**
 * Export an HTML element to PNG and trigger download
 */
export async function downloadPng(
  element: HTMLElement,
  scale: number = 2,
  filename: string = "equation.png",
): Promise<void> {
  const dataUrl = await toPng(element, {
    pixelRatio: scale,
    backgroundColor: undefined, // Transparent
  });

  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

/**
 * Export an HTML element to SVG and trigger download
 */
export async function downloadSvg(
  element: HTMLElement,
  filename: string = "equation.svg",
): Promise<void> {
  const dataUrl = await toSvg(element, {
    backgroundColor: undefined, // Transparent
  });

  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

/**
 * Copy an HTML element as PNG to clipboard
 */
export async function copyToClipboard(
  element: HTMLElement,
  scale: number = 2,
): Promise<boolean> {
  try {
    const dataUrl = await toPng(element, {
      pixelRatio: scale,
      backgroundColor: undefined,
    });

    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);

    return true;
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    return false;
  }
}

// History management
export type HistoryItem = {
  latex: string;
  timestamp: number;
};

const HISTORY_KEY = "latex-to-image-history";
const MAX_HISTORY = 20;

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as HistoryItem[];
  } catch {
    return [];
  }
}

export function saveToHistory(latex: string): HistoryItem[] {
  if (typeof window === "undefined") return [];

  const trimmed = latex.trim();
  if (!trimmed) return loadHistory();

  try {
    let history = loadHistory();

    // Remove duplicate if exists
    history = history.filter((item) => item.latex !== trimmed);

    // Add new item at the beginning
    history.unshift({ latex: trimmed, timestamp: Date.now() });

    // Limit history size
    history = history.slice(0, MAX_HISTORY);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return history;
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
}
