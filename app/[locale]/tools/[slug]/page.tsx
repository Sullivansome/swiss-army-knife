import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Base64Tool } from "@/components/tools/base64-tool";
import { CaseConverterTool } from "@/components/tools/case-converter";
import { DiffCheckerTool } from "@/components/tools/diff-checker";
import { LoremIpsumTool } from "@/components/tools/lorem-ipsum";
import { MarkdownPreviewTool } from "@/components/tools/markdown-preview";
import { WordCounterTool } from "@/components/tools/word-counter";
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
        ) : tool.slug === "word-counter" ? (
          <WordCounterTool
            labels={{
              input: dict.wordCounter.input,
              characters: dict.wordCounter.characters,
              words: dict.wordCounter.words,
              lines: dict.wordCounter.lines,
              reset: dict.wordCounter.reset,
              placeholder: dict.wordCounter.placeholder,
            }}
          />
        ) : tool.slug === "case-converter" ? (
          <CaseConverterTool
            labels={{
              input: dict.caseConverter.input,
              output: dict.caseConverter.output,
              upper: dict.caseConverter.upper,
              lower: dict.caseConverter.lower,
              camel: dict.caseConverter.camel,
              snake: dict.caseConverter.snake,
              kebab: dict.caseConverter.kebab,
              title: dict.caseConverter.title,
              copy: dict.caseConverter.copy,
              reset: dict.caseConverter.reset,
              placeholder: dict.caseConverter.placeholder,
            }}
          />
        ) : tool.slug === "diff-checker" ? (
          <DiffCheckerTool
            labels={{
              left: dict.diffChecker.left,
              right: dict.diffChecker.right,
              summary: dict.diffChecker.summary,
              added: dict.diffChecker.added,
              removed: dict.diffChecker.removed,
              button: dict.diffChecker.button,
              noDiff: dict.diffChecker.noDiff,
              placeholderLeft: dict.diffChecker.placeholderLeft,
              placeholderRight: dict.diffChecker.placeholderRight,
            }}
          />
        ) : tool.slug === "lorem-ipsum" ? (
          <LoremIpsumTool
            labels={{
              paragraphs: dict.loremIpsum.paragraphs,
              words: dict.loremIpsum.words,
              generate: dict.loremIpsum.generate,
              copy: dict.loremIpsum.copy,
              placeholder: dict.loremIpsum.placeholder,
            }}
          />
        ) : tool.slug === "markdown-preview" ? (
          <MarkdownPreviewTool
            labels={{
              input: dict.markdown.input,
              preview: dict.markdown.preview,
              placeholder: dict.markdown.placeholder,
            }}
          />
        ) : null}
      </ToolShell>
    </div>
  );
}
