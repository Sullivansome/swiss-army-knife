"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { StudioPanel } from "@/components/ui/studio/studio-panel";
import { StudioToolbar } from "@/components/ui/studio/studio-toolbar";
import { ToolStudio } from "@/components/ui/studio/tool-studio";
import {
  DEFAULT_MARKDOWN,
  MARKDOWN_REHYPE_PLUGINS,
  MARKDOWN_REMARK_PLUGINS,
} from "@/lib/markdown";

type Props = {
  labels: {
    input: string;
    preview: string;
    placeholder: string;
  };
};

export function MarkdownPreviewTool({ labels }: Props) {
  const [value, setValue] = useState(DEFAULT_MARKDOWN);

  return (
    <div className="flex flex-col">
      <StudioToolbar>
        <div className="flex items-center gap-2"></div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setValue("")}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </StudioToolbar>

      <ToolStudio layout="split">
        <StudioPanel
          title={labels.input}
          actions={<CopyButton value={value} size="icon-sm" variant="ghost" />}
        >
          <textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={labels.placeholder}
            className="h-[600px] w-full resize-none rounded-md bg-transparent p-4 font-mono text-sm focus:outline-none"
          />
        </StudioPanel>

        <StudioPanel
          title={labels.preview}
          className="bg-card"
          contentClassName="overflow-auto max-h-[600px]"
        >
          <div className="prose prose-sm max-w-none p-4 dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[...MARKDOWN_REMARK_PLUGINS]}
              rehypePlugins={[...MARKDOWN_REHYPE_PLUGINS]}
            >
              {value}
            </ReactMarkdown>
          </div>
        </StudioPanel>
      </ToolStudio>
    </div>
  );
}

export default MarkdownPreviewTool;
