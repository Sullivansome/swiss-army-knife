import Link from "next/link";

import { LocaleSwitcher } from "./locale-switcher";
import { ModeToggle } from "./mode-toggle";

type Props = {
  locale: string;
  dict: {
    brand: string;
    navTools: string;
    navHome: string;
    language: string;
  };
};

export async function SiteHeader({ locale, dict }: Props) {
  return (
    <header className="border-b bg-card/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
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
        <div className="flex items-center gap-2">
          <LocaleSwitcher label={dict.language} />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
