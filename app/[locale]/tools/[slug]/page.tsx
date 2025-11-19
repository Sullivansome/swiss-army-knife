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
import { ImageToPdfTool } from "@/components/tools/image-to-pdf";
import { ListDedupSortTool } from "@/components/tools/list-dedup-sort";
import { CsvJsonConverterTool } from "@/components/tools/csv-json-converter";
import { RandomPickerTool } from "@/components/tools/random-picker";
import { ImageCompressorTool } from "@/components/tools/image-compressor";
import { ImageConverterTool } from "@/components/tools/image-converter";
import { SocialMockupTool } from "@/components/tools/social-mockup";
import { PaletteGeneratorTool } from "@/components/tools/palette-generator";
import { SvgRecolorTool } from "@/components/tools/svg-recolor";
import { EmojiCleanerTool } from "@/components/tools/emoji-cleaner";
import { SocialFormatterTool } from "@/components/tools/social-formatter";
import { AdvancedWordCountTool } from "@/components/tools/advanced-word-count";
import { DateCalculatorTool } from "@/components/tools/date-calculator";
import { FinanceCalculatorTool } from "@/components/tools/finance-calculator";
import { BmiCalculatorTool } from "@/components/tools/bmi-calculator";
import { UnitConverterTool } from "@/components/tools/unit-converter";
import { VideoToGifTool } from "@/components/tools/video-to-gif";
import { OcrTool } from "@/components/tools/ocr";
import { ToolShell } from "@/components/tool-shell";
import { getDictionary, type Dictionary } from "@/lib/dictionaries";
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
  const rendered = renderTool(tool.slug, dict);

  if (!rendered) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <ToolShell title={toolDict?.name ?? tool.slug} description={toolDict?.description}>
        {rendered}
      </ToolShell>
    </div>
  );
}

function renderTool(slug: string, dict: Dictionary) {
  switch (slug) {
    case "base64":
      return (
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
      );
    case "word-counter":
      return (
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
      );
    case "case-converter":
      return (
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
      );
    case "json-formatter":
      return (
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
      );
    case "diff-checker":
      return (
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
      );
    case "lorem-ipsum":
      return (
        <LoremIpsumTool
          labels={{
            paragraphs: dict.loremIpsum.paragraphs,
            words: dict.loremIpsum.words,
            generate: dict.loremIpsum.generate,
            copy: dict.loremIpsum.copy,
            placeholder: dict.loremIpsum.placeholder,
          }}
        />
      );
    case "markdown-preview":
      return (
        <MarkdownPreviewTool
          labels={{
            input: dict.markdown.input,
            preview: dict.markdown.preview,
            placeholder: dict.markdown.placeholder,
          }}
        />
      );
    case "password-generator":
      return (
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
      );
    case "uuid-generator":
      return (
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
      );
    case "hash-generator":
      return (
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
      );
    case "qr-generator":
      return (
        <QrGeneratorTool
          labels={{
            input: dict.qrGenerator.input,
            size: dict.qrGenerator.size,
            download: dict.qrGenerator.download,
            placeholder: dict.qrGenerator.placeholder,
          }}
        />
      );
    case "exif-viewer":
      return (
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
      );
    case "color-converter":
      return (
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
      );
    case "image-to-pdf":
      return <ImageToPdfTool labels={dict.imageToPdf} />;
    case "list-dedup-sort":
      return <ListDedupSortTool labels={dict.listTool} />;
    case "csv-json-converter":
      return <CsvJsonConverterTool labels={dict.csvJson} />;
    case "random-picker":
      return <RandomPickerTool labels={dict.randomPicker} />;
    case "image-compressor":
      return <ImageCompressorTool labels={dict.imageCompressor} />;
    case "image-converter":
      return <ImageConverterTool labels={dict.imageConverter} />;
    case "social-mockup":
      return <SocialMockupTool labels={dict.socialMockup} />;
    case "palette-generator":
      return <PaletteGeneratorTool labels={dict.paletteGenerator} />;
    case "svg-recolor":
      return <SvgRecolorTool labels={dict.svgRecolor} />;
    case "emoji-cleaner":
      return <EmojiCleanerTool labels={dict.emojiCleaner} />;
    case "social-formatter":
      return <SocialFormatterTool labels={dict.socialFormatter} />;
    case "advanced-word-count":
      return <AdvancedWordCountTool labels={dict.advancedWordCount} />;
    case "date-calculator":
      return <DateCalculatorTool labels={dict.dateCalculator} />;
    case "finance-calculator":
      return <FinanceCalculatorTool labels={dict.financeCalculator} />;
    case "bmi-calculator":
      return <BmiCalculatorTool labels={dict.bmiCalculator} />;
    case "unit-converter":
      return <UnitConverterTool labels={dict.unitConverter} />;
    case "video-to-gif":
      return <VideoToGifTool labels={dict.videoToGif} />;
    case "ocr":
      return <OcrTool labels={dict.ocr} />;
    default:
      return null;
  }
}
