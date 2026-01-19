import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { getDictionary } from "@/lib/dictionaries";
import { assertLocale, locales } from "@/lib/i18n-config";

import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Tool Center - Free Online Tools",
    template: "%s | Tool Center",
  },
  description:
    "Free online tools for everyday tasks - QR code generator, random picker, image compressor, and more. No signup required, works offline.",
  keywords: [
    "free online tools",
    "QR code generator",
    "random picker",
    "image compressor",
    "unit converter",
    "online utilities",
  ],
  verification: {
    google: "iYqwGCbeg7R6VHI2MVyjSvfkhy-PPK3i9rTn45CjzvE",
  },
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
