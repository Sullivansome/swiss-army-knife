"use client";

import { Download, Move, QrCode, Sliders, Type } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { WidgetCard } from "@/components/ui/widget-card";
import { normalizeQrSize, QR_DOWNLOAD_NAME } from "@/lib/qr";

type Props = {
  labels: {
    input: string;
    size: string;
    download: string;
    placeholder: string;
  };
};

export function QrGeneratorTool({ labels }: Props) {
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = QR_DOWNLOAD_NAME;
    link.click();
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <WidgetCard title="Configuration" className="h-full">
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="qr-input"
                  className="text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <Type className="h-4 w-4 text-muted-foreground" />
                  {labels.input}
                </label>
                <textarea
                  id="qr-input"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder={labels.placeholder}
                  className="h-32 w-full resize-none rounded-xl border bg-background p-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

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
                  max={1000}
                  step={10}
                  value={size}
                  onChange={(event) =>
                    setSize(normalizeQrSize(Number(event.target.value)))
                  }
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </WidgetCard>
        </div>

        <div className="space-y-6">
          <WidgetCard className="h-full flex flex-col items-center justify-center p-8 bg-muted/10">
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <QRCodeCanvas
                value={text || "https://example.com"}
                size={size > 300 ? 300 : size}
                includeMargin
                ref={canvasRef}
                className="max-w-full h-auto"
                style={{ width: "100%", height: "auto", maxHeight: "300px" }}
              />
            </div>

            <div className="mt-8 w-full">
              <Button
                size="lg"
                onClick={handleDownload}
                disabled={!text}
                className="w-full shadow-lg shadow-primary/20"
              >
                <Download className="mr-2 h-4 w-4" />
                {labels.download}
              </Button>
              {!text && (
                <p className="text-xs text-center text-muted-foreground mt-3 animate-pulse">
                  Enter text to enable download
                </p>
              )}
            </div>
          </WidgetCard>
        </div>
      </div>
    </div>
  );
}

export default QrGeneratorTool;
