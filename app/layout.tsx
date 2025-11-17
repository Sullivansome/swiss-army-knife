import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The actual document (<html> and <body>) is defined in app/[locale]/layout.tsx
  // to keep per-locale configuration (lang, messages, theme) in one place.
  return children;
}
