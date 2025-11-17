"use client";

import { ChangeEvent } from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";

import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations("layout");
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value;
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <select
      className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
      value={locale}
      onChange={handleChange}
      aria-label={t("language")}
    >
      {routing.locales.map((value) => (
        <option key={value} value={value}>
          {value.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
