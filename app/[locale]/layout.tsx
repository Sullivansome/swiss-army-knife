import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
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
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <SiteHeader
              locale={locale}
              dict={dict.layout}
              categories={dict.categories}
              toolsDict={dict.tools}
            />
            <main className="flex-1 pb-16">{children}</main>
            <SiteFooter dict={dict.layout} />
            <Toaster richColors position="top-center" closeButton />
            <Analytics />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
