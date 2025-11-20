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
import { TemperatureConverterTool } from "@/components/tools/temperature-converter";
import { FamilyRelationCalculator } from "@/components/tools/family-relation-calculator";
import { LunarNewYearTool } from "@/components/tools/lunar-new-year";
import { FinanceNumberCaseTool } from "@/components/tools/finance-number-case";
import { FinanceEssentialsTool } from "@/components/tools/finance-essentials";
import { BaseConverterTool } from "@/components/tools/base-converter";
import { ComputerBaseConverterTool } from "@/components/tools/computer-base-converter";
import { RegexPlaygroundTool } from "@/components/tools/regex-playground";
import { JwtInspectorTool } from "@/components/tools/jwt-inspector";
import { ColorContrastChecker } from "@/components/tools/color-contrast-checker";
import { TimezonePlanner } from "@/components/tools/timezone-planner";
import { CronExplainerTool } from "@/components/tools/cron-explainer";
import { StatisticsSummaryTool } from "@/components/tools/statistics-summary";
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
  const { slug, locale: raw } = await params;
  const tool = getTool(slug);

  if (!tool) {
    return {};
  }

  const locale = assertLocale(raw);
  const dict = await getDictionary(locale);
  const toolDict = dict.tools[tool.slug as keyof typeof dict.tools];

  return {
    title: toolDict?.name ?? tool.slug,
    description: toolDict?.description ?? tool.slug,
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
    case "regex-playground":
      return (
        <RegexPlaygroundTool
          labels={{
            patternLabel: dict.regexPlayground.patternLabel,
            patternPlaceholder: dict.regexPlayground.patternPlaceholder,
            flagsLabel: dict.regexPlayground.flagsLabel,
            flagsHint: dict.regexPlayground.flagsHint,
            sampleLabel: dict.regexPlayground.sampleLabel,
            samplePlaceholder: dict.regexPlayground.samplePlaceholder,
            matchesLabel: dict.regexPlayground.matchesLabel,
            noMatches: dict.regexPlayground.noMatches,
            helper: dict.regexPlayground.helper,
            error: dict.regexPlayground.error,
            clear: dict.toolShell.clear,
            indexLabel: dict.regexPlayground.indexLabel,
            groupLabel: dict.regexPlayground.groupLabel,
            highlightLabel: dict.regexPlayground.highlightLabel,
            flagDescriptions: dict.regexPlayground.flagDescriptions,
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
    case "jwt-inspector":
      return (
        <JwtInspectorTool
          labels={{
            inputLabel: dict.jwtInspector.inputLabel,
            placeholder: dict.jwtInspector.placeholder,
            helper: dict.jwtInspector.helper,
            headerTitle: dict.jwtInspector.headerTitle,
            payloadTitle: dict.jwtInspector.payloadTitle,
            signatureTitle: dict.jwtInspector.signatureTitle,
            claimsTitle: dict.jwtInspector.claimsTitle,
            copyJson: dict.jwtInspector.copyJson,
            copied: dict.jwtInspector.copied,
            invalidStructure: dict.jwtInspector.invalidStructure,
            decodeError: dict.jwtInspector.decodeError,
            statusActive: dict.jwtInspector.statusActive,
            statusExpired: dict.jwtInspector.statusExpired,
            expiresIn: dict.jwtInspector.expiresIn,
            expiredAgo: dict.jwtInspector.expiredAgo,
            noExpiry: dict.jwtInspector.noExpiry,
            noClaims: dict.jwtInspector.noClaims,
            signatureMissing: dict.jwtInspector.signatureMissing,
            signaturePresent: dict.jwtInspector.signaturePresent,
            issuer: dict.jwtInspector.issuer,
            subject: dict.jwtInspector.subject,
            audience: dict.jwtInspector.audience,
            expires: dict.jwtInspector.expires,
            issuedAt: dict.jwtInspector.issuedAt,
            validFrom: dict.jwtInspector.validFrom,
            durationUnits: dict.jwtInspector.durationUnits,
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
    case "color-contrast-checker":
      return (
        <ColorContrastChecker
          labels={{
            textColor: dict.colorContrast.textColor,
            backgroundColor: dict.colorContrast.backgroundColor,
            swap: dict.colorContrast.swap,
            ratioLabel: dict.colorContrast.ratioLabel,
            aaNormal: dict.colorContrast.aaNormal,
            aaLarge: dict.colorContrast.aaLarge,
            aaa: dict.colorContrast.aaa,
            pass: dict.colorContrast.pass,
            fail: dict.colorContrast.fail,
            previewLabel: dict.colorContrast.previewLabel,
            helper: dict.colorContrast.helper,
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
    case "timezone-meeting-planner":
      return (
        <TimezonePlanner
          labels={{
            meetingTime: dict.timezonePlanner.meetingTime,
            baseTimezone: dict.timezonePlanner.baseTimezone,
            timezoneHint: dict.timezonePlanner.timezoneHint,
            participants: dict.timezonePlanner.participants,
            addTimezone: dict.timezonePlanner.addTimezone,
            removeTimezone: dict.timezonePlanner.removeTimezone,
            workingHours: dict.timezonePlanner.workingHours,
            offHours: dict.timezonePlanner.offHours,
            copySummary: dict.timezonePlanner.copySummary,
            copied: dict.timezonePlanner.copied,
            emptyState: dict.timezonePlanner.emptyState,
            timelineLabel: dict.timezonePlanner.timelineLabel,
          }}
        />
      );
    case "finance-calculator":
      return <FinanceCalculatorTool labels={dict.financeCalculator} />;
    case "bmi-calculator":
      return <BmiCalculatorTool labels={dict.bmiCalculator} />;
    case "unit-converter":
      return <UnitConverterTool labels={dict.unitConverter} />;
    case "statistics-summary":
      return (
        <StatisticsSummaryTool
          labels={{
            inputLabel: dict.statisticsSummary.inputLabel,
            placeholder: dict.statisticsSummary.placeholder,
            invalidCount: dict.statisticsSummary.invalidCount,
            metrics: dict.statisticsSummary.metrics,
            empty: dict.statisticsSummary.empty,
            chartLabel: dict.statisticsSummary.chartLabel,
            copySummary: dict.statisticsSummary.copySummary,
            copied: dict.statisticsSummary.copied,
          }}
        />
      );
    case "international-temperature-converter":
      return (
        <TemperatureConverterTool
          labels={dict.temperatureConverter}
          units={[
            { value: "celsius", label: dict.temperatureConverter.units.celsius },
            { value: "fahrenheit", label: dict.temperatureConverter.units.fahrenheit },
            { value: "kelvin", label: dict.temperatureConverter.units.kelvin },
            { value: "rankine", label: dict.temperatureConverter.units.rankine },
          ]}
        />
      );
    case "family-relation-calculator":
      return <FamilyRelationCalculator labels={dict.familyRelation} />;
    case "lunar-new-year-essentials":
      return <LunarNewYearTool labels={dict.lunarNewYear} />;
    case "finance-number-case-converter":
      return <FinanceNumberCaseTool labels={dict.financeNumberCase} />;
    case "finance-essentials":
      return <FinanceEssentialsTool labels={dict.financeToolkit} />;
    case "base-converter":
      return <BaseConverterTool labels={dict.baseConverter} />;
    case "computer-base-converter":
      return <ComputerBaseConverterTool labels={dict.computerBaseConverter} />;
    case "cron-explainer":
      return (
        <CronExplainerTool
          labels={{
            expressionLabel: dict.cronExplainer.expressionLabel,
            placeholder: dict.cronExplainer.placeholder,
            helper: dict.cronExplainer.helper,
            timezoneLabel: dict.cronExplainer.timezoneLabel,
            parseError: dict.cronExplainer.parseError,
            fields: dict.cronExplainer.fields,
            unitNames: dict.cronExplainer.unitNames,
            months: dict.cronExplainer.months,
            weekdays: dict.cronExplainer.weekdays,
            descriptions: dict.cronExplainer.descriptions,
            nextRuns: dict.cronExplainer.nextRuns,
            copySchedule: dict.cronExplainer.copySchedule,
            copied: dict.cronExplainer.copied,
          }}
        />
      );
    case "video-to-gif":
      return <VideoToGifTool labels={dict.videoToGif} />;
    case "ocr":
      return <OcrTool labels={dict.ocr} />;
    default:
      return null;
  }
}
