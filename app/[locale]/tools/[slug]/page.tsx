import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Base64Tool } from "@/components/tools/base64-tool";
import { ToolShell } from "@/components/tool-shell";
import { getTool, tools } from "@/lib/tools";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) {
    return {};
  }

  const t = await getTranslations();
  const title = t(tool.nameKey);
  const description = t(tool.descriptionKey);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getTool(slug);
  const t = await getTranslations();

  if (!tool) {
    notFound();
  }

  const title = t(tool.nameKey);
  const description = t(tool.descriptionKey);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <ToolShell title={title} description={description}>
        {tool.slug === "base64" ? <Base64Tool /> : null}
      </ToolShell>
    </div>
  );
}
