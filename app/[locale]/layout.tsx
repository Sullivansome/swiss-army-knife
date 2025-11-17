import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { assertLocale, locales } from "@/lib/i18n-config";
import { getDictionary } from "@/lib/dictionaries";

import "../globals.css";

export const metadata: Metadata = {
  title: "Tool Center",
  description: "Browser-first utilities for developers and creators.",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: raw } = await params;
  const locale = assertLocale(raw);
  if (!locales.includes(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background text-foreground">
            <SiteHeader locale={locale} dict={dict.layout} />
            <main className="pb-16">{children}</main>
            <SiteFooter dict={dict.layout} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
