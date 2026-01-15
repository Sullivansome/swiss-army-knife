"use client";

import {
  ArrowDownAZ,
  ArrowUpAZ,
  CaseSensitive,
  List as ListIcon,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { StudioPanel } from "@/components/ui/studio/studio-panel";
import { StudioToolbar } from "@/components/ui/studio/studio-toolbar";
import { ToolStudio } from "@/components/ui/studio/tool-studio";
import { processList, type SortMode } from "@/lib/list-utils";
import { cn } from "@/lib/utils";

export type ListToolLabels = {
  input: string;
  placeholder: string;
  result: string;
  sortLabel: string;
  sortAsc: string;
  sortDesc: string;
  original: string;
  caseSensitive: string;
  copy: string;
  clear: string;
};

type Props = {
  labels: ListToolLabels;
};

export function ListDedupSortTool({ labels }: Props) {
  const [input, setInput] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("none");

  const processed = useMemo(
    () => processList(input, caseSensitive, sortMode).join("\n"),
    [input, caseSensitive, sortMode],
  );

  const setSort = (mode: SortMode) => setSortMode(mode);

  return (
    <div className="flex flex-col">
      <StudioToolbar className="h-auto flex-wrap gap-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            variant={sortMode === "none" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSort("none")}
          >
            <ListIcon className="mr-2 h-4 w-4" />
            {labels.original}
          </Button>
          <Button
            variant={sortMode === "asc" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSort("asc")}
          >
            <ArrowDownAZ className="mr-2 h-4 w-4" />
            {labels.sortAsc}
          </Button>
          <Button
            variant={sortMode === "desc" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSort("desc")}
          >
            <ArrowUpAZ className="mr-2 h-4 w-4" />
            {labels.sortDesc}
          </Button>
        </div>

        <div className="w-px h-6 bg-border mx-2 hidden sm:block" />

        <Button
          variant={caseSensitive ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setCaseSensitive(!caseSensitive)}
        >
          <CaseSensitive className="mr-2 h-4 w-4" />
          {labels.caseSensitive}
        </Button>

        <div className="flex-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setInput("")}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {labels.clear}
        </Button>
      </StudioToolbar>

      <ToolStudio layout="split">
        <StudioPanel
          title={labels.input}
          actions={<CopyButton value={input} size="icon-sm" variant="ghost" />}
        >
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={labels.placeholder}
            className="h-[500px] w-full resize-none rounded-md bg-transparent p-4 font-mono text-sm focus:outline-none"
          />
        </StudioPanel>

        <StudioPanel
          title={labels.result}
          actions={<CopyButton value={processed} label={labels.copy} />}
        >
          <textarea
            value={processed}
            readOnly
            className="h-[500px] w-full resize-none rounded-md bg-transparent p-4 font-mono text-sm focus:outline-none text-muted-foreground"
          />
        </StudioPanel>
      </ToolStudio>
    </div>
  );
}

export default ListDedupSortTool;
