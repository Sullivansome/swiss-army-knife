"use client";

import { AlertTriangle, Download, Image, Move, Palette, X } from "lucide-react";
import QRCodeStyling, {
  type CornerDotType,
  type CornerSquareType,
  type DotType,
} from "qr-code-styling";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { WidgetCard } from "@/components/ui/widget-card";
import {
  EXPORT_FORMATS,
  type ExportFormat,
  getContrastRatio,
  MIN_CONTRAST_RATIO,
  normalizeQrSize,
  PNG_SIZES,
  type PngSize,
  QR_DOWNLOAD_NAME,
} from "@/lib/qr";
import {
  canDownload as checkCanDownload,
  defaultEmailData,
  defaultPhoneData,
  defaultSmsData,
  defaultTextData,
  defaultUrlData,
  defaultWifiData,
  getQrData,
  type QrContent,
  type QrContentType,
} from "@/lib/qr-content";
import { ContentTypeSelector } from "./content-type-selector";
import { EmailFields } from "./fields/email";
import { PhoneFields } from "./fields/phone";
import { SmsFields } from "./fields/sms";
import { TextFields } from "./fields/text";
import { UrlFields } from "./fields/url";
import { WifiFields } from "./fields/wifi";

const STYLE_PRESETS = [
  { name: "Classic", fg: "#000000", bg: "#FFFFFF" },
  { name: "Dark", fg: "#FFFFFF", bg: "#1a1a1a" },
  { name: "Ocean", fg: "#0369a1", bg: "#e0f2fe" },
  { name: "Forest", fg: "#166534", bg: "#dcfce7" },
  { name: "Sunset", fg: "#c2410c", bg: "#ffedd5" },
  { name: "Purple", fg: "#7c3aed", bg: "#f3e8ff" },
] as const;

const DOT_STYLES: { name: string; value: DotType }[] = [
  { name: "Square", value: "square" },
  { name: "Rounded", value: "rounded" },
  { name: "Dots", value: "dots" },
  { name: "Classy", value: "classy" },
  { name: "Classy Rounded", value: "classy-rounded" },
  { name: "Extra Rounded", value: "extra-rounded" },
];

const CORNER_STYLES: {
  name: string;
  dot: CornerDotType;
  square: CornerSquareType;
}[] = [
  { name: "Square", dot: "square", square: "square" },
  { name: "Rounded", dot: "dot", square: "extra-rounded" },
  { name: "Dots", dot: "dot", square: "dot" },
];

type Props = {
  labels: {
    input: string;
    size: string;
    download: string;
    placeholder: string;
    contentType: {
      label: string;
      url: string;
      text: string;
      wifi: string;
      email: string;
      sms: string;
      phone: string;
    };
    wifi: {
      ssid: string;
      ssidPlaceholder: string;
      password: string;
      passwordPlaceholder: string;
      encryption: string;
      wpa: string;
      wep: string;
      none: string;
      hidden: string;
    };
    email: {
      address: string;
      addressPlaceholder: string;
      subject: string;
      body: string;
    };
    sms: {
      phone: string;
      phonePlaceholder: string;
      message: string;
    };
    phone: {
      number: string;
      placeholder: string;
    };
    url: {
      placeholder: string;
    };
    text: {
      placeholder: string;
    };
    export: {
      format: string;
      size: string;
      downloading: string;
    };
    contrast: {
      warning: string;
    };
  };
};

export function QrGeneratorTool({ labels }: Props) {
  // Content type state
  const [contentType, setContentType] = useState<QrContentType>("url");
  const [urlData, setUrlData] = useState<QrContent["url"]>(defaultUrlData);
  const [textData, setTextData] = useState<QrContent["text"]>(defaultTextData);
  const [wifiData, setWifiData] = useState<QrContent["wifi"]>(defaultWifiData);
  const [emailData, setEmailData] =
    useState<QrContent["email"]>(defaultEmailData);
  const [smsData, setSmsData] = useState<QrContent["sms"]>(defaultSmsData);
  const [phoneData, setPhoneData] =
    useState<QrContent["phone"]>(defaultPhoneData);

  // Styling state
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [logoPercent, setLogoPercent] = useState(15);
  const [dotStyle, setDotStyle] = useState<DotType>("rounded");
  const [cornerStyle, setCornerStyle] = useState(CORNER_STYLES[1]);

  // Export options state
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [pngSize, setPngSize] = useState<PngSize>(1024);
  const [isDownloading, setIsDownloading] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Strict limit: 18% max to guarantee scannability (level H = 30% error correction)
  const MAX_LOGO_PERCENT = 18;
  const logoSizePx = Math.round((size * logoPercent) / 100);

  // Create QR code instance once
  const qrCodeRef = useRef<QRCodeStyling | null>(null);

  // Compute QR data string based on content type
  const qrData = useMemo(
    () =>
      getQrData(
        contentType,
        urlData,
        textData,
        wifiData,
        emailData,
        smsData,
        phoneData,
      ),
    [contentType, urlData, textData, wifiData, emailData, smsData, phoneData],
  );

  // Check if download should be enabled
  const canDownloadQr = useMemo(
    () =>
      checkCanDownload(
        contentType,
        urlData,
        textData,
        wifiData,
        emailData,
        smsData,
        phoneData,
      ),
    [contentType, urlData, textData, wifiData, emailData, smsData, phoneData],
  );

  // Check contrast ratio
  const contrastRatio = useMemo(
    () => getContrastRatio(fgColor, bgColor),
    [fgColor, bgColor],
  );
  const hasLowContrast = contrastRatio < MIN_CONTRAST_RATIO;

  // Initialize QR code instance
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling({
        width: size,
        height: size,
        type: "svg",
        data: qrData,
        margin: 0,
        qrOptions: {
          errorCorrectionLevel: "H",
        },
        dotsOptions: {
          color: fgColor,
          type: dotStyle,
        },
        backgroundOptions: {
          color: bgColor,
        },
        cornersSquareOptions: {
          color: fgColor,
          type: cornerStyle.square,
        },
        cornersDotOptions: {
          color: fgColor,
          type: cornerStyle.dot,
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 4,
          imageSize: logoPercent / 100,
          hideBackgroundDots: true,
        },
        image: logoSrc || undefined,
      });
    }
  }, []);

  // Append QR code to container
  useEffect(() => {
    if (!qrCodeRef.current || !containerRef.current) return;
    containerRef.current.innerHTML = "";
    qrCodeRef.current.append(containerRef.current);
  }, []);

  // Update QR code when options change
  useEffect(() => {
    if (!qrCodeRef.current) return;
    qrCodeRef.current.update({
      data: qrData,
      width: size,
      height: size,
      margin: 0,
      dotsOptions: {
        color: fgColor,
        type: dotStyle,
      },
      backgroundOptions: {
        color: bgColor,
      },
      cornersSquareOptions: {
        color: fgColor,
        type: cornerStyle.square,
      },
      cornersDotOptions: {
        color: fgColor,
        type: cornerStyle.dot,
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 4,
        imageSize: logoPercent / 100,
        hideBackgroundDots: true,
      },
      image: logoSrc || undefined,
    });
  }, [
    qrData,
    size,
    fgColor,
    bgColor,
    dotStyle,
    cornerStyle,
    logoSrc,
    logoPercent,
  ]);

  const handleDownload = async () => {
    if (!qrCodeRef.current) return;
    setIsDownloading(true);

    try {
      if (exportFormat === "svg") {
        await qrCodeRef.current.download({
          name: QR_DOWNLOAD_NAME,
          extension: "svg",
        });
      } else {
        // Temporarily update size for high-res export
        qrCodeRef.current.update({ width: pngSize, height: pngSize });
        await qrCodeRef.current.download({
          name: QR_DOWNLOAD_NAME,
          extension: "png",
        });
        // Restore preview size
        qrCodeRef.current.update({ width: size, height: size });
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoSrc(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const applyPreset = (preset: (typeof STYLE_PRESETS)[number]) => {
    setFgColor(preset.fg);
    setBgColor(preset.bg);
  };

  // Render the appropriate field component based on content type
  const renderFields = () => {
    switch (contentType) {
      case "url":
        return (
          <UrlFields data={urlData} onChange={setUrlData} labels={labels.url} />
        );
      case "text":
        return (
          <TextFields
            data={textData}
            onChange={setTextData}
            labels={labels.text}
          />
        );
      case "wifi":
        return (
          <WifiFields
            data={wifiData}
            onChange={setWifiData}
            labels={labels.wifi}
          />
        );
      case "email":
        return (
          <EmailFields
            data={emailData}
            onChange={setEmailData}
            labels={labels.email}
          />
        );
      case "sms":
        return (
          <SmsFields data={smsData} onChange={setSmsData} labels={labels.sms} />
        );
      case "phone":
        return (
          <PhoneFields
            data={phoneData}
            onChange={setPhoneData}
            labels={labels.phone}
          />
        );
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <WidgetCard title="Configuration" className="h-full">
            <div className="space-y-6">
              {/* Content Type Selector */}
              <ContentTypeSelector
                value={contentType}
                onChange={setContentType}
                labels={labels.contentType}
              />

              {/* Dynamic Fields based on content type */}
              {renderFields()}

              {/* Size Slider */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="qr-size"
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <Move className="h-4 w-4 text-muted-foreground" />
                    {labels.size}
                  </label>
                  <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                    {size}px
                  </span>
                </div>
                <input
                  id="qr-size"
                  type="range"
                  min={100}
                  max={500}
                  step={10}
                  value={size}
                  onChange={(event) =>
                    setSize(normalizeQrSize(Number(event.target.value)))
                  }
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Style Presets */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  Color Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {STYLE_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all
                        hover:ring-2 hover:ring-primary/20
                        ${fgColor === preset.fg && bgColor === preset.bg ? "ring-2 ring-primary border-primary" : "border-border"}
                      `}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-border/50"
                        style={{
                          background: `linear-gradient(135deg, ${preset.fg} 50%, ${preset.bg} 50%)`,
                        }}
                      />
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dot Style */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Dot Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {DOT_STYLES.map((style) => (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => setDotStyle(style.value)}
                      className={`
                        px-3 py-1.5 rounded-lg border text-xs font-medium transition-all
                        hover:ring-2 hover:ring-primary/20
                        ${dotStyle === style.value ? "ring-2 ring-primary border-primary bg-primary/5" : "border-border"}
                      `}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Corner Style */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Corner Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {CORNER_STYLES.map((style) => (
                    <button
                      key={style.name}
                      type="button"
                      onClick={() => setCornerStyle(style)}
                      className={`
                        px-3 py-1.5 rounded-lg border text-xs font-medium transition-all
                        hover:ring-2 hover:ring-primary/20
                        ${cornerStyle.name === style.name ? "ring-2 ring-primary border-primary bg-primary/5" : "border-border"}
                      `}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Pickers */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="fg-color"
                    className="text-sm font-medium text-foreground"
                  >
                    Foreground
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="fg-color"
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border bg-background"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="bg-color"
                    className="text-sm font-medium text-foreground"
                  >
                    Background
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="bg-color"
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border bg-background"
                    />
                  </div>
                </div>
              </div>

              {/* Contrast Warning */}
              {hasLowContrast && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-xs">{labels.contrast.warning}</span>
                </div>
              )}

              {/* Logo Upload */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Image className="h-4 w-4 text-muted-foreground" />
                  Center Logo
                </label>
                {logoSrc ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                      <img
                        src={logoSrc}
                        alt="Logo preview"
                        className="w-10 h-10 object-contain rounded"
                      />
                      <span className="text-sm text-muted-foreground flex-1">
                        Logo uploaded
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeLogo}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Logo Size
                        </span>
                        <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                          {logoPercent}% ({logoSizePx}px)
                        </span>
                      </div>
                      <input
                        type="range"
                        min={8}
                        max={MAX_LOGO_PERCENT}
                        step={1}
                        value={logoPercent}
                        onChange={(e) => setLogoPercent(Number(e.target.value))}
                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-2 pb-3">
                      <Image className="w-6 h-6 mb-2 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        Click to upload logo
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </WidgetCard>
        </div>

        <div className="space-y-6">
          <WidgetCard className="h-full flex flex-col items-center justify-center p-8 bg-muted/10">
            <div
              className="rounded-xl shadow-sm border flex items-center justify-center overflow-hidden transition-opacity duration-150 ease-out"
              style={{ backgroundColor: bgColor }}
            >
              <div
                ref={containerRef}
                className="max-w-full"
                style={{
                  width: Math.min(size, 300),
                  height: Math.min(size, 300),
                }}
              />
            </div>

            {/* Export Options */}
            <div className="mt-6 w-full space-y-4">
              {/* Format Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {labels.export.format}
                </label>
                <div className="flex gap-2">
                  {EXPORT_FORMATS.map((format) => (
                    <button
                      key={format}
                      type="button"
                      onClick={() => setExportFormat(format)}
                      className={`
                        flex-1 px-3 py-2 rounded-lg border text-xs font-medium uppercase transition-all
                        hover:ring-2 hover:ring-primary/20
                        ${exportFormat === format ? "ring-2 ring-primary border-primary bg-primary/5" : "border-border"}
                      `}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              {/* PNG Size Selector (only visible when PNG selected) */}
              {exportFormat === "png" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {labels.export.size}
                  </label>
                  <div className="flex gap-2">
                    {PNG_SIZES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPngSize(s)}
                        className={`
                          flex-1 px-3 py-2 rounded-lg border text-xs font-medium transition-all
                          hover:ring-2 hover:ring-primary/20
                          ${pngSize === s ? "ring-2 ring-primary border-primary bg-primary/5" : "border-border"}
                        `}
                      >
                        {s}px
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 w-full">
              <Button
                size="lg"
                onClick={handleDownload}
                disabled={!canDownloadQr || isDownloading}
                className="w-full shadow-lg shadow-primary/20"
              >
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? labels.export.downloading : labels.download}
              </Button>
              {!canDownloadQr && (
                <p className="text-xs text-center text-muted-foreground mt-3 animate-pulse">
                  Enter content to enable download
                </p>
              )}
            </div>
          </WidgetCard>
        </div>
      </div>

      {/* Mobile Sticky Preview */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-background border-t shadow-lg z-40">
        <div className="flex items-center gap-4 p-4 max-w-screen-sm mx-auto">
          <div
            className="w-16 h-16 rounded-lg border flex-shrink-0 flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: bgColor }}
          >
            <div
              ref={(el) => {
                if (el && qrCodeRef.current) {
                  el.innerHTML = "";
                  const clone = containerRef.current
                    ?.querySelector("svg")
                    ?.cloneNode(true);
                  if (clone) {
                    (clone as SVGElement).setAttribute("width", "64");
                    (clone as SVGElement).setAttribute("height", "64");
                    el.appendChild(clone);
                  }
                }
              }}
              className="w-full h-full flex items-center justify-center"
            />
          </div>
          <Button
            size="lg"
            onClick={handleDownload}
            disabled={!canDownloadQr || isDownloading}
            className="flex-1 shadow-lg shadow-primary/20"
          >
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? labels.export.downloading : labels.download}
          </Button>
        </div>
      </div>

      {/* Spacer for mobile sticky bar */}
      <div className="h-24 lg:hidden" />
    </div>
  );
}

export default QrGeneratorTool;
