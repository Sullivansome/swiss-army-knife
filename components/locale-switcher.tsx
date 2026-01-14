"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import type { ChangeEvent } from "react";

import { locales } from "@/lib/i18n-config";

type Props = {
  label: string;
};

export function LocaleSwitcher({ label }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = (params?.locale as string) || "en";

  const localeLabels: Record<string, string> = {
    en: "English",
    zh: "简体中文",
  };

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value;
    const stripped = pathname.replace(/^\/[a-zA-Z-]+(?=\/|$)/, "");
    const target = `/${nextLocale}${stripped || ""}`;
    router.replace(target);
  };

  return (
    <select
      className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
      value={currentLocale}
      onChange={handleChange}
      aria-label={label}
    >
      {locales.map((value) => (
        <option key={value} value={value}>
          {localeLabels[value] ?? value.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
