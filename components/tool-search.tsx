"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { Dictionary } from "@/lib/dictionaries";
import { type ToolCategory, tools } from "@/lib/tools";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

type ToolSearchDict = {
  searchLabel: string;
  searchPlaceholder: string;
  searchShortcut: string;
  searchNoResults: string;
};

type Props = {
  locale: string;
  layout: ToolSearchDict;
  categories: Dictionary["categories"];
  toolsDict: Dictionary["tools"];
  className?: string;
};

const categoryOrder: ToolCategory[] = [
  "productivity",
  "design",
  "social",
  "life",
  "数据换算",
  "dev",
  "text",
  "media",
  "security",
  "time",
  "math",
  "wasm",
];

export function ToolSearch({
  locale,
  layout,
  categories,
  toolsDict,
  className,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const grouped = useMemo(() => {
    const enhanced = tools.map((tool) => {
      const copy = toolsDict[tool.slug as keyof typeof toolsDict] ?? {};
      return {
        ...tool,
        tags: tool.tags ?? [],
        name: copy.name ?? tool.slug,
        description: copy.description ?? "",
        categoryLabel: categories[tool.category],
      };
    });

    return categoryOrder
      .map((category) => ({
        category,
        categoryLabel: categories[category],
        items: enhanced.filter((item) => item.category === category),
      }))
      .filter((group) => group.items.length > 0);
  }, [categories, toolsDict]);

  const normalizedQuery = searchValue.trim().toLowerCase();

  const scoreTool = useCallback(
    (
      item: (typeof grouped)[number]["items"][number],
      query: string,
    ): number => {
      const q = query.toLowerCase();
      const name = item.name.toLowerCase();
      const slug = item.slug.toLowerCase();
      const description = item.description.toLowerCase();
      const category = item.categoryLabel.toLowerCase();
      const tags = item.tags.map((tag) => tag.toLowerCase());

      let score = 0;
      if (!q) return score;

      const parts = q.split(/\s+/).filter(Boolean);
      const includes = (value: string) => value.includes(q);
      const startsWith = (value: string) => value.startsWith(q);

      if (name === q) score += 12;
      if (slug === q) score += 10;
      if (startsWith(name)) score += 8;
      if (startsWith(slug)) score += 6;
      if (tags.some((tag) => startsWith(tag))) score += 5;
      if (includes(name)) score += 4;
      if (tags.some((tag) => includes(tag))) score += 3;
      if (includes(slug)) score += 2;
      if (includes(description)) score += 2;
      if (includes(category)) score += 1;

      parts.forEach((part) => {
        if (part === q) return;
        if (name.includes(part)) score += 2;
        if (slug.includes(part)) score += 1;
        if (tags.some((tag) => tag.includes(part))) score += 1;
        if (description.includes(part)) score += 1;
      });
      return score;
    },
    [],
  );

  const filteredGroups = useMemo(() => {
    return grouped
      .map((group) => {
        const itemsWithScore = group.items.map((item) => ({
          ...item,
          score: normalizedQuery ? scoreTool(item, normalizedQuery) : 0,
        }));

        const filtered = normalizedQuery
          ? itemsWithScore.filter((item) => item.score > 0)
          : itemsWithScore;

        const sorted = normalizedQuery
          ? filtered.sort(
              (a, b) => b.score - a.score || a.name.localeCompare(b.name),
            )
          : filtered;

        return { ...group, items: sorted };
      })
      .filter((group) => group.items.length > 0);
  }, [grouped, normalizedQuery, scoreTool]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSearchValue("");
    }
  };

  const handleSelect = (slug: string) => {
    handleOpenChange(false);
    router.push(`/${locale}/tools/${slug}`);
  };

  return (
    <div className={cn("w-full", className)}>
      <Button
        type="button"
        variant="outline"
        className="flex h-10 w-full items-center justify-between gap-2 rounded-md bg-muted/60 px-3 py-2 text-left text-sm font-normal text-muted-foreground shadow-none hover:bg-muted"
        onClick={() => handleOpenChange(true)}
        aria-label={`${layout.searchLabel} (${layout.searchShortcut})`}
      >
        <div className="flex items-center gap-2">
          <SearchIcon className="size-4" />
          <span className="truncate">{layout.searchPlaceholder}</span>
        </div>
        <span className="rounded border bg-background px-2 py-1 text-[11px] font-medium leading-none text-muted-foreground">
          {layout.searchShortcut}
        </span>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
        title={layout.searchLabel}
        description={layout.searchPlaceholder}
        commandProps={{ shouldFilter: false }}
      >
        <CommandInput
          value={searchValue}
          onValueChange={setSearchValue}
          placeholder={layout.searchPlaceholder}
        />
        <CommandList>
          {filteredGroups.length === 0 ? (
            <CommandEmpty>{layout.searchNoResults}</CommandEmpty>
          ) : null}
          {filteredGroups.map((group) => (
            <CommandGroup key={group.category} heading={group.categoryLabel}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.slug}
                  value={item.slug}
                  onSelect={() => handleSelect(item.slug)}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">
                      {item.name}
                    </span>
                    {item.description ? (
                      <span className="text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    ) : null}
                  </div>
                  <span className="ml-auto rounded-full bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                    {item.categoryLabel}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </div>
  );
}
