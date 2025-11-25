import Link from "next/link";

import type { Dictionary } from "@/lib/dictionaries";
import { LocaleSwitcher } from "./locale-switcher";
import { ModeToggle } from "./mode-toggle";
import { ToolSearch } from "./tool-search";

type Props = {
  locale: string;
  dict: {
    brand: string;
    navTools: string;
    navHome: string;
    language: string;
    searchLabel: string;
    searchPlaceholder: string;
    searchShortcut: string;
    searchNoResults: string;
  };
  categories: Dictionary["categories"];
  toolsDict: Dictionary["tools"];
};

export async function SiteHeader({ locale, dict, categories, toolsDict }: Props) {
  return (
    <header className="border-b bg-card/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href={`/${locale}`} className="text-lg font-semibold tracking-tight text-foreground">
            {dict.brand}
          </Link>
          <nav className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Link
              href={`/${locale}`}
              className="rounded-md px-3 py-2 hover:bg-muted hover:text-foreground"
            >
              {dict.navHome}
            </Link>
            <Link
              href={`/${locale}/tools`}
              className="rounded-md px-3 py-2 hover:bg-muted hover:text-foreground"
            >
              {dict.navTools}
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center gap-2 min-w-[260px]">
          <ToolSearch
            locale={locale}
            layout={{
              searchLabel: dict.searchLabel,
              searchPlaceholder: dict.searchPlaceholder,
              searchShortcut: dict.searchShortcut,
              searchNoResults: dict.searchNoResults,
            }}
            categories={categories}
            toolsDict={toolsDict}
            className="max-w-xl min-w-[220px] flex-1"
          />
          <LocaleSwitcher label={dict.language} />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
