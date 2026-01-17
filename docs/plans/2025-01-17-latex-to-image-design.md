# LaTeX to Image Tool — Design Document

**Date:** 2025-01-17
**Status:** Approved

---

## Overview

A client-side LaTeX equation renderer that converts math expressions to downloadable images (PNG/SVG) with live preview, using KaTeX for rendering.

### Key Characteristics

- **Pure client-side** — no server required, works offline
- **Studio split layout** — LaTeX input left, live preview right
- **KaTeX rendering** — fast, lightweight (~300KB)
- **Export options** — PNG, SVG, clipboard copy

---

## File Structure

```
app/[locale]/tools/latex-to-image/
  └── page.tsx                    # Server Component (route + labels)

components/tools/latex-to-image/
  └── index.tsx                   # Client Component (tool logic)

lib/latex/
  └── index.ts                    # Pure functions: rendering, export utilities
```

### Dependencies

- `katex` — LaTeX rendering
- `html-to-image` — Canvas export for PNG

---

## Component Structure

### State

```typescript
const [latex, setLatex] = useState(DEFAULT_EXAMPLE)
const [scale, setScale] = useState(2)           // 1-5 range (100%-500%)
const [textColor, setTextColor] = useState("#000000")
const [bgColor, setBgColor] = useState("transparent")
const [darkPreview, setDarkPreview] = useState(false)
const [history, setHistory] = useState<HistoryItem[]>([]) // from localStorage
```

### Component Hierarchy

```
<StudioToolbar>
  ├── ExampleDropdown        # Pre-built equation templates
  ├── ColorPicker (text)     # Text color
  ├── ColorPicker (bg)       # Background color
  ├── ScaleSlider            # Output size (100%-500%)
  └── DarkModeToggle         # Preview background toggle
</StudioToolbar>

<ToolStudio layout="split">
  ├── <StudioPanel title="LaTeX Input">
  │     ├── <textarea>       # LaTeX code input
  │     └── <HistoryDropdown> # Recent equations
  │
  └── <StudioPanel title="Preview">
        ├── <KaTeXPreview>   # Live rendered output
        └── <ExportActions>  # Copy | PNG | SVG buttons
</ToolStudio>
```

---

## Features & Behavior

### Live Preview

- Debounced rendering (300ms delay after typing stops)
- KaTeX renders to HTML with `katex.renderToString()`
- Error handling: show inline error message if LaTeX is invalid
- Preview container has checkered background (transparency indicator)

### Export Functions

| Function | Output | Method |
|----------|--------|--------|
| `copyToClipboard()` | PNG blob | `html-to-image` → `navigator.clipboard.write()` |
| `downloadPng()` | PNG file | `html-to-image` → download link |
| `downloadSvg()` | SVG file | KaTeX SVG output → download link |

### Scale Options

- 100%, 150%, 200%, 300%, 500%
- Applied via CSS `transform: scale()` on preview
- Higher pixel density on export

### Example Templates

```typescript
const EXAMPLES = [
  { name: "Quadratic Formula", latex: "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}" },
  { name: "Euler's Identity", latex: "e^{i\\pi} + 1 = 0" },
  { name: "Integral", latex: "\\int_{-1}^{1} \\sqrt{1-x^2}\\ dx = \\frac{\\pi}{2}" },
  { name: "Summation", latex: "\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}" },
  { name: "Matrix", latex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}" },
]
```

### History

- Store last 20 equations in `localStorage`
- Each entry: `{ latex: string, timestamp: number }`
- Load on mount, save on successful render (debounced)

---

## UI Layout

### Toolbar

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Examples ▾]  [Text: ■]  [Bg: ◻]  [Scale: 200% ▾]  │  [☀/☾ Toggle] │
└─────────────────────────────────────────────────────────────────────┘
```

### Main Layout

```
┌─────────────────────────────────────────────────────┐
│ [Toolbar: Examples ▾] [Color] [Scale] [Dark toggle] │
├─────────────────────────┬───────────────────────────┤
│  LATEX INPUT            │  PREVIEW                  │
│  ───────────────────    │  ───────────────────      │
│  \frac{\pi}{2} = ...    │     π                     │
│                         │    ─── = ∫ √(1-x²) dx     │
│                         │     2                     │
│                         │                           │
│  [History ▾]            │  [Copy] [PNG] [SVG]       │
└─────────────────────────┴───────────────────────────┘
```

### Responsive Behavior

- Desktop (≥1024px): Side-by-side split (50/50)
- Mobile (<1024px): Stacked vertically, input on top

---

## I18n Labels

```typescript
type Labels = {
  input: string;           // "LaTeX Input"
  preview: string;         // "Preview"
  placeholder: string;     // "Enter LaTeX equation..."
  examples: string;        // "Examples"
  textColor: string;       // "Text Color"
  bgColor: string;         // "Background"
  scale: string;           // "Scale"
  copy: string;            // "Copy"
  copySuccess: string;     // "Copied to clipboard!"
  downloadPng: string;     // "PNG"
  downloadSvg: string;     // "SVG"
  history: string;         // "Recent equations"
  clearHistory: string;    // "Clear history"
  error: string;           // "Invalid LaTeX"
  darkMode: string;        // "Dark preview"
}
```

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Invalid LaTeX syntax | Show KaTeX error message below preview, red border |
| Empty input | Show placeholder text in preview area |
| Clipboard API unavailable | Fallback: show "Copy not supported" toast |
| Export fails | Toast: "Export failed, please try again" |

---

## Implementation Checklist

1. [ ] Install dependencies (`katex`, `html-to-image`)
2. [ ] Create `lib/latex/index.ts` with render & export utilities
3. [ ] Create `components/tools/latex-to-image/index.tsx`
4. [ ] Create `app/[locale]/tools/latex-to-image/page.tsx`
5. [ ] Add i18n labels (en, zh if applicable)
6. [ ] Run `bun run generate` to update registry
7. [ ] Test all export formats
8. [ ] Test responsive layout
