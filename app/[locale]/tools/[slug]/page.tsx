import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Base64Tool } from "@/components/tools/base64-tool";
import { CaseConverterTool } from "@/components/tools/case-converter";
import { DiffCheckerTool } from "@/components/tools/diff-checker";
import { ColorConverterTool } from "@/components/tools/color-converter";
import { ExifViewerTool } from "@/components/tools/exif-viewer";
import { HashGeneratorTool } from "@/components/tools/hash-generator";
import { JsonFormatterTool } from "@/components/tools/json-formatter";
import { LoremIpsumTool } from "@/components/tools/lorem-ipsum";
import { MarkdownPreviewTool } from "@/components/tools/markdown-preview";
import { PasswordGeneratorTool } from "@/components/tools/password-generator";
import { QrGeneratorTool } from "@/components/tools/qr-generator";
import { UuidGeneratorTool } from "@/components/tools/uuid-generator";
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
        ) : tool.slug === "json-formatter" ? (
          <JsonFormatterTool
            labels={{
              input: dict.jsonFormatter.input,
              output: dict.jsonFormatter.output,
              format: dict.jsonFormatter.format,
              validate: dict.jsonFormatter.validate,
              clear: dict.jsonFormatter.clear,
              copy: dict.jsonFormatter.copy,
              placeholder: dict.jsonFormatter.placeholder,
              error: dict.jsonFormatter.error,
              valid: dict.jsonFormatter.valid,
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
        ) : tool.slug === "password-generator" ? (
          <PasswordGeneratorTool
            labels={{
              length: dict.passwordGenerator.length,
              uppercase: dict.passwordGenerator.uppercase,
              lowercase: dict.passwordGenerator.lowercase,
              numbers: dict.passwordGenerator.numbers,
              symbols: dict.passwordGenerator.symbols,
              generate: dict.passwordGenerator.generate,
              copy: dict.passwordGenerator.copy,
              password: dict.passwordGenerator.password,
              placeholder: dict.passwordGenerator.placeholder,
            }}
          />
        ) : tool.slug === "uuid-generator" ? (
          <UuidGeneratorTool
            labels={{
              count: dict.uuidGenerator.count,
              countHelper: dict.uuidGenerator.countHelper,
              generate: dict.uuidGenerator.generate,
              copy: dict.uuidGenerator.copy,
              error: dict.uuidGenerator.error,
              placeholder: dict.uuidGenerator.placeholder,
            }}
          />
        ) : tool.slug === "hash-generator" ? (
          <HashGeneratorTool
            labels={{
              input: dict.hashGenerator.input,
              algo: dict.hashGenerator.algo,
              md5: dict.hashGenerator.md5,
              sha256: dict.hashGenerator.sha256,
              sha512: dict.hashGenerator.sha512,
              hash: dict.hashGenerator.hash,
              compute: dict.hashGenerator.compute,
              copy: dict.hashGenerator.copy,
              placeholder: dict.hashGenerator.placeholder,
            }}
          />
        ) : tool.slug === "qr-generator" ? (
          <QrGeneratorTool
            labels={{
              input: dict.qrGenerator.input,
              size: dict.qrGenerator.size,
              download: dict.qrGenerator.download,
              placeholder: dict.qrGenerator.placeholder,
            }}
          />
        ) : tool.slug === "exif-viewer" ? (
          <ExifViewerTool
            labels={{
              upload: dict.exifViewer.upload,
              camera: dict.exifViewer.camera,
              model: dict.exifViewer.model,
              datetime: dict.exifViewer.datetime,
              noData: dict.exifViewer.noData,
              error: dict.exifViewer.error,
              instruction: dict.exifViewer.instruction,
            }}
          />
        ) : tool.slug === "color-converter" ? (
          <ColorConverterTool
            labels={{
              hex: dict.colorConverter.hex,
              rgb: dict.colorConverter.rgb,
              copy: dict.colorConverter.copy,
              placeholderHex: dict.colorConverter.placeholderHex,
              placeholderRgb: dict.colorConverter.placeholderRgb,
              invalid: dict.colorConverter.invalid,
            }}
          />
        ) : null}
      </ToolShell>
    </div>
  );
}
