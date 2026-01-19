"use client";

import "katex/dist/katex.min.css";

import {
  ClipboardCopy,
  Download,
  History,
  Moon,
  Sun,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { StudioPanel } from "@/components/ui/studio/studio-panel";
import { StudioToolbar } from "@/components/ui/studio/studio-toolbar";
import { ToolStudio } from "@/components/ui/studio/tool-studio";
import {
  clearHistory,
  copyToClipboard,
  DEFAULT_LATEX,
  downloadPng,
  downloadSvg,
  type HistoryItem,
  loadHistory,
  renderLatex,
  saveToHistory,
} from "@/lib/latex";

type Props = {
  labels: {
    input: string;
    preview: string;
    placeholder: string;
    textColor: string;
    bgColor: string;
    copy: string;
    copySuccess: string;
    downloadPng: string;
    downloadSvg: string;
    history: string;
    clearHistory: string;
    error: string;
    darkMode: string;
    emptyPreview: string;
    transparent: string;
  };
};

export function LatexToImageTool({ labels }: Props) {
  const [latex, setLatex] = useState<string>(DEFAULT_LATEX);
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [darkPreview, setDarkPreview] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  // Load history on mount
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // Debounced save to history
  useEffect(() => {
    const result = renderLatex(latex);
    if (!result.success) return;

    const timeout = setTimeout(() => {
      setHistory(saveToHistory(latex));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [latex]);

  // Render LaTeX
  const renderResult = useMemo(() => renderLatex(latex), [latex]);

  // Handle copy to clipboard
  const handleCopy = useCallback(async () => {
    if (!exportRef.current) return;

    const success = await copyToClipboard(exportRef.current, 2);
    if (success) {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  }, []);

  // Handle PNG download
  const handleDownloadPng = useCallback(async () => {
    if (!exportRef.current) return;
    await downloadPng(exportRef.current, 2);
  }, []);

  // Handle SVG download
  const handleDownloadSvg = useCallback(async () => {
    if (!exportRef.current) return;
    await downloadSvg(exportRef.current);
  }, []);

  // Handle clear history
  const handleClearHistory = useCallback(() => {
    clearHistory();
    setHistory([]);
    setShowHistory(false);
  }, []);

  // Handle select from history
  const handleSelectHistory = useCallback((item: HistoryItem) => {
    setLatex(item.latex);
    setShowHistory(false);
  }, []);

  return (
    <div className="flex flex-col">
      <StudioToolbar>
        <div className="flex flex-wrap items-center gap-2">
          {/* Text color */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">
              {labels.textColor}
            </span>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="h-7 w-7 cursor-pointer rounded border bg-transparent p-0.5"
            />
          </div>

          {/* Background color */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">
              {labels.bgColor}
            </span>
            <div className="flex items-center gap-1">
              <input
                type="color"
                value={bgColor || "#ffffff"}
                onChange={(e) => setBgColor(e.target.value)}
                onClick={() => {
                  // If transparent, clicking color picker should set to white first
                  if (!bgColor) setBgColor("#ffffff");
                }}
                className="h-7 w-7 cursor-pointer rounded border bg-transparent p-0.5"
              />
              <Button
                variant={!bgColor ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setBgColor(!bgColor ? "#ffffff" : "")}
              >
                {labels.transparent}
              </Button>
            </div>
          </div>
        </div>

        {/* Dark mode toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDarkPreview(!darkPreview)}
          title={labels.darkMode}
        >
          {darkPreview ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </StudioToolbar>

      <ToolStudio layout="split">
        {/* Input Panel */}
        <StudioPanel
          title={labels.input}
          actions={
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowHistory(!showHistory);
                }}
                disabled={history.length === 0}
              >
                <History className="mr-1 h-4 w-4" />
                {labels.history}
              </Button>
              {showHistory && history.length > 0 && (
                <div className="absolute right-0 top-full z-50 mt-1 w-72 rounded-md border bg-popover p-1 shadow-md">
                  <div className="max-h-60 overflow-auto">
                    {history.map((item, index) => (
                      <button
                        key={`${item.timestamp}-${index}`}
                        className="flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
                        onClick={() => handleSelectHistory(item)}
                      >
                        <span className="truncate font-mono text-xs">
                          {item.latex}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="border-t pt-1">
                    <button
                      className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-accent"
                      onClick={handleClearHistory}
                    >
                      <Trash2 className="mr-2 h-3 w-3" />
                      {labels.clearHistory}
                    </button>
                  </div>
                </div>
              )}
            </div>
          }
        >
          <textarea
            value={latex}
            onChange={(e) => setLatex(e.target.value)}
            placeholder={labels.placeholder}
            className="h-[400px] w-full resize-none rounded-md bg-transparent p-4 font-mono text-sm focus:outline-none"
            spellCheck={false}
          />
        </StudioPanel>

        {/* Preview Panel */}
        <StudioPanel
          title={labels.preview}
          className={darkPreview ? "bg-zinc-900" : "bg-card"}
          contentClassName="flex flex-col"
        >
          {/* Preview area with checkered background */}
          <div
            ref={previewRef}
            className={`flex-1 min-h-[300px] flex items-center justify-center rounded-md overflow-auto ${
              !bgColor
                ? "bg-[linear-gradient(45deg,#e0e0e0_25%,transparent_25%),linear-gradient(-45deg,#e0e0e0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e0e0e0_75%),linear-gradient(-45deg,transparent_75%,#e0e0e0_75%)] bg-[size:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px] dark:bg-[linear-gradient(45deg,#333_25%,transparent_25%),linear-gradient(-45deg,#333_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#333_75%),linear-gradient(-45deg,transparent_75%,#333_75%)]"
                : ""
            }`}
            style={bgColor ? { backgroundColor: bgColor } : undefined}
          >
            {renderResult.success ? (
              <div
                ref={exportRef}
                className="p-4"
                style={{
                  color: textColor,
                  backgroundColor: bgColor || "transparent",
                }}
                dangerouslySetInnerHTML={{ __html: renderResult.html }}
              />
            ) : latex.trim() ? (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {labels.error}: {renderResult.error}
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">
                {labels.emptyPreview}
              </div>
            )}
          </div>

          {/* Export actions */}
          <div className="flex items-center justify-center gap-2 border-t pt-4 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!renderResult.success}
            >
              <ClipboardCopy className="mr-2 h-4 w-4" />
              {copyFeedback ? labels.copySuccess : labels.copy}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPng}
              disabled={!renderResult.success}
            >
              <Download className="mr-2 h-4 w-4" />
              {labels.downloadPng}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadSvg}
              disabled={!renderResult.success}
            >
              <Download className="mr-2 h-4 w-4" />
              {labels.downloadSvg}
            </Button>
          </div>
        </StudioPanel>
      </ToolStudio>

      {/* Click outside to close dropdowns */}
      {showHistory && (
        <button
          type="button"
          aria-label="Close history"
          className="fixed inset-0 z-40 cursor-default bg-transparent border-none"
          onClick={() => {
            setShowHistory(false);
          }}
        />
      )}
    </div>
  );
}

export default LatexToImageTool;
