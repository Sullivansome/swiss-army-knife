import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  renderLatex,
  DEFAULT_LATEX,
  LATEX_EXAMPLES,
  loadHistory,
  saveToHistory,
  clearHistory,
} from "@/lib/latex";

describe("renderLatex", () => {
  it("renders valid LaTeX successfully", () => {
    const result = renderLatex("x^2 + y^2 = z^2");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.html).toContain("katex");
    }
  });

  it("renders the default LaTeX example", () => {
    const result = renderLatex(DEFAULT_LATEX);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.html).toBeTruthy();
    }
  });

  it("renders fractions correctly", () => {
    const result = renderLatex("\\frac{a}{b}");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.html).toContain("frac");
    }
  });

  it("renders square roots correctly", () => {
    const result = renderLatex("\\sqrt{x}");
    expect(result.success).toBe(true);
  });

  it("renders integrals correctly", () => {
    const result = renderLatex("\\int_{0}^{\\infty} e^{-x} dx");
    expect(result.success).toBe(true);
  });

  it("renders summations correctly", () => {
    const result = renderLatex("\\sum_{n=1}^{\\infty} \\frac{1}{n^2}");
    expect(result.success).toBe(true);
  });

  it("renders matrices correctly", () => {
    const result = renderLatex("\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}");
    expect(result.success).toBe(true);
  });

  it("returns error for empty input", () => {
    const result = renderLatex("");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Empty input");
    }
  });

  it("returns error for whitespace-only input", () => {
    const result = renderLatex("   ");
    expect(result.success).toBe(false);
  });

  it("returns error for invalid LaTeX syntax", () => {
    const result = renderLatex("\\frac{a}");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeTruthy();
    }
  });

  it("returns error for unclosed braces", () => {
    const result = renderLatex("\\sqrt{x");
    expect(result.success).toBe(false);
  });

  it("returns error for unknown commands", () => {
    const result = renderLatex("\\unknowncommand{x}");
    expect(result.success).toBe(false);
  });
});

describe("LATEX_EXAMPLES", () => {
  it("has at least 5 examples", () => {
    expect(LATEX_EXAMPLES.length).toBeGreaterThanOrEqual(5);
  });

  it("each example has a name and latex property", () => {
    for (const example of LATEX_EXAMPLES) {
      expect(example.name).toBeTruthy();
      expect(example.latex).toBeTruthy();
    }
  });

  it("all examples render successfully", () => {
    for (const example of LATEX_EXAMPLES) {
      const result = renderLatex(example.latex);
      expect(result.success).toBe(true);
    }
  });

  it("includes common equations (quadratic, euler)", () => {
    const names = LATEX_EXAMPLES.map((e) => e.name.toLowerCase());
    expect(names.some((n) => n.includes("quadratic"))).toBe(true);
    expect(names.some((n) => n.includes("euler"))).toBe(true);
  });
});

describe("DEFAULT_LATEX", () => {
  it("is a non-empty string", () => {
    expect(typeof DEFAULT_LATEX).toBe("string");
    expect(DEFAULT_LATEX.length).toBeGreaterThan(0);
  });

  it("renders successfully", () => {
    const result = renderLatex(DEFAULT_LATEX);
    expect(result.success).toBe(true);
  });
});

describe("History management", () => {
  const HISTORY_KEY = "latex-to-image-history";

  beforeEach(() => {
    // Clear localStorage before each test
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(HISTORY_KEY);
    }
  });

  afterEach(() => {
    // Cleanup
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(HISTORY_KEY);
    }
  });

  it("loadHistory returns empty array when no history exists", () => {
    const history = loadHistory();
    expect(history).toEqual([]);
  });

  it("saveToHistory does not add empty strings", () => {
    const history = saveToHistory("");
    expect(history).toEqual([]);
  });

  it("saveToHistory does not add whitespace-only strings", () => {
    const history = saveToHistory("   ");
    expect(history).toEqual([]);
  });

  it("clearHistory removes all history", () => {
    clearHistory();
    const history = loadHistory();
    expect(history).toEqual([]);
  });
});

describe("Edge cases", () => {
  it("handles special characters in LaTeX", () => {
    const result = renderLatex("\\alpha + \\beta = \\gamma");
    expect(result.success).toBe(true);
  });

  it("handles subscripts and superscripts", () => {
    const result = renderLatex("x_1^2 + x_2^2");
    expect(result.success).toBe(true);
  });

  it("handles limits", () => {
    const result = renderLatex("\\lim_{x \\to \\infty} f(x)");
    expect(result.success).toBe(true);
  });

  it("handles trig functions", () => {
    const result = renderLatex("\\sin(x) + \\cos(y) = \\tan(z)");
    expect(result.success).toBe(true);
  });

  it("handles logarithms", () => {
    const result = renderLatex("\\log_2(x) + \\ln(y)");
    expect(result.success).toBe(true);
  });

  it("handles complex nested expressions", () => {
    const result = renderLatex("\\frac{\\sqrt{x^2 + y^2}}{\\int_0^1 f(t) dt}");
    expect(result.success).toBe(true);
  });

  it("handles text in math mode", () => {
    const result = renderLatex("x = 5 \\text{ if } y > 0");
    expect(result.success).toBe(true);
  });

  it("handles binomial coefficients", () => {
    const result = renderLatex("\\binom{n}{k}");
    expect(result.success).toBe(true);
  });
});
