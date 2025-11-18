"use client";

import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

import { Button } from "@/components/ui/button";

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
  const [size, setSize] = useState(200);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "qr-code.png";
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="qr-input">
          {labels.input}
        </label>
        <input
          id="qr-input"
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={labels.placeholder}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-foreground" htmlFor="qr-size">
          {labels.size}
        </label>
        <input
          id="qr-size"
          type="number"
          min={100}
          max={500}
          value={size}
          onChange={(event) => setSize(Number(event.target.value))}
          className="w-28 rounded-lg border bg-background px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button variant="outline" onClick={handleDownload} disabled={!text}>
          {labels.download}
        </Button>
      </div>

      <div className="flex items-center justify-center rounded-lg border bg-muted/50 p-4">
        <QRCodeCanvas value={text} size={size} includeMargin ref={canvasRef} />
      </div>
    </div>
  );
}
