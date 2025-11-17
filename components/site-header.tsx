import { getTranslations } from "next-intl/server";

import { Link } from "@/navigation";

import { LocaleSwitcher } from "./locale-switcher";
import { ModeToggle } from "./mode-toggle";

export async function SiteHeader() {
  const t = await getTranslations("layout");

  return (
    <header className="border-b bg-card/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
          {t("brand")}
        </Link>
        <nav className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Link href="/" className="rounded-md px-3 py-2 hover:bg-muted hover:text-foreground">
            {t("navHome")}
          </Link>
          <Link href="/tools" className="rounded-md px-3 py-2 hover:bg-muted hover:text-foreground">
            {t("navTools")}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
