"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

type Props = {
  labels: {
    input: string;
    preview: string;
    placeholder: string;
  };
};

export function MarkdownPreviewTool({ labels }: Props) {
  const [value, setValue] = useState("# Markdown\n\n- Write on the left\n- Preview on the right");

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="markdown-input">
          {labels.input}
        </label>
        <textarea
          id="markdown-input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={labels.placeholder}
          className="min-h-72 w-full rounded-lg border bg-background p-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium text-foreground">{labels.preview}</div>
        <div className="prose prose-sm max-w-none rounded-lg border bg-card p-4 dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{value}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
