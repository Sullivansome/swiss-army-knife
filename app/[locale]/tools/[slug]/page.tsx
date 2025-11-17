import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Base64Tool } from "@/components/tools/base64-tool";
import { ToolShell } from "@/components/tool-shell";
import { getDictionary } from "@/lib/dictionaries";
import { assertLocale } from "@/lib/i18n-config";
import { getTool, tools } from "@/lib/tools";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const locales = ["en", "zh"];
  return tools.flatMap((tool) => locales.map((locale) => ({ slug: tool.slug, locale })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) {
    return {};
  }

  return {
    title: tool.slug,
    description: tool.slug,
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug, locale: raw } = await params;
  const locale = assertLocale(raw);
  const tool = getTool(slug);
  if (!tool) {
    notFound();
  }

  const dict = await getDictionary(locale);
  const toolDict = dict.tools[tool.slug as keyof typeof dict.tools];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <ToolShell title={toolDict?.name ?? tool.slug} description={toolDict?.description}>
        {tool.slug === "base64" ? (
          <Base64Tool
            labels={{
              input: dict.toolShell.input,
              output: dict.toolShell.output,
              clear: dict.toolShell.clear,
              copy: dict.toolShell.copy,
              error: dict.toolShell.error,
              encode: dict.base64.encode,
              decode: dict.base64.decode,
              placeholder: dict.base64.placeholder,
            }}
          />
        ) : null}
      </ToolShell>
    </div>
  );
}
