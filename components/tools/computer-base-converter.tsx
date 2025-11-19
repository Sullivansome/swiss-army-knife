"use client";

import { useMemo, useState } from "react";

import { bigintBitLength, convertBase, convertToDecimal, padBinary } from "@/lib/base";

export type ComputerBaseLabels = {
  inputLabel: string;
  baseLabel: string;
  bitWidthLabel: string;
  bitLengthLabel: string;
  approxBytesLabel: string;
  paddedBinaryLabel: string;
  paddedHexLabel: string;
  outputsTitle: string;
  invalid: string;
  bases: {
    binary: string;
    octal: string;
    decimal: string;
    hex: string;
  };
};

const bitWidths = [8, 16, 32, 64];

export function ComputerBaseConverterTool({ labels }: { labels: ComputerBaseLabels }) {
  const [value, setValue] = useState("FF");
  const [inputBase, setInputBase] = useState(16);
  const [bitWidth, setBitWidth] = useState(32);

  const info = useMemo(() => {
    if (!value.trim()) {
      return null;
    }
    try {
      const decimal = convertToDecimal(value.trim(), inputBase);
      const binary = convertBase(value.trim(), inputBase, 2);
      const hex = convertBase(value.trim(), inputBase, 16).toUpperCase();
      const octal = convertBase(value.trim(), inputBase, 8);
      const bitLength = bigintBitLength(decimal);
      const paddedBinary = padBinary(binary.replace("-", ""), bitWidth);
      const paddedHex = hex.replace("-", "").padStart(bitWidth / 4, "0");
      const sign = binary.startsWith("-");
      return {
        bitLength,
        bytes: Math.ceil(bitLength / 8),
        binary: sign ? `-${binary.slice(1)}` : binary,
        octal,
        hex,
        decimal: decimal.toString(),
        paddedBinary: sign ? `-${paddedBinary}` : paddedBinary,
        paddedHex: sign ? `-${paddedHex}` : paddedHex,
      };
    } catch {
      return { error: labels.invalid };
    }
  }, [value, inputBase, bitWidth, labels.invalid]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="computer-base-value">
            {labels.inputLabel}
          </label>
          <input
            id="computer-base-value"
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm font-mono"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="computer-base-select">
            {labels.baseLabel}
          </label>
          <select
            id="computer-base-select"
            value={inputBase}
            onChange={(event) => setInputBase(Number(event.target.value))}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          >
            <option value={2}>{labels.bases.binary}</option>
            <option value={8}>{labels.bases.octal}</option>
            <option value={10}>{labels.bases.decimal}</option>
            <option value={16}>{labels.bases.hex}</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="bit-width">
            {labels.bitWidthLabel}
          </label>
          <select
            id="bit-width"
            value={bitWidth}
            onChange={(event) => setBitWidth(Number(event.target.value))}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          >
            {bitWidths.map((width) => (
              <option key={width} value={width}>
                {width} bit
              </option>
            ))}
          </select>
        </div>
      </div>

      {info && "error" in info ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm text-destructive">
          {info.error}
        </p>
      ) : null}

      {info && !("error" in info) ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border bg-card px-4 py-3 text-sm">
              <p className="text-muted-foreground">{labels.bitLengthLabel}</p>
              <p className="text-2xl font-semibold text-foreground">{info.bitLength}</p>
            </div>
            <div className="rounded-xl border bg-card px-4 py-3 text-sm">
              <p className="text-muted-foreground">{labels.approxBytesLabel}</p>
              <p className="text-2xl font-semibold text-foreground">{info.bytes}</p>
            </div>
          </div>
          <div className="rounded-2xl border bg-card px-5 py-6 shadow-sm">
            <p className="text-sm font-semibold text-foreground">{labels.outputsTitle}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <ValueCard label={labels.bases.binary} value={info.binary} />
              <ValueCard label={labels.bases.octal} value={info.octal} />
              <ValueCard label={labels.bases.decimal} value={info.decimal} />
              <ValueCard label={labels.bases.hex} value={info.hex} />
            </div>
            <div className="mt-4 space-y-2 rounded-xl border bg-muted/30 px-4 py-3 text-sm">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">{labels.paddedBinaryLabel}</p>
                <p className="font-mono text-base text-foreground">{info.paddedBinary}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">{labels.paddedHexLabel}</p>
                <p className="font-mono text-base text-foreground">{info.paddedHex}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type ValueCardProps = {
  label: string;
  value: string;
};

function ValueCard({ label, value }: ValueCardProps) {
  return (
    <div className="rounded-xl border bg-background px-4 py-3 text-sm">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-lg text-foreground">{value}</p>
    </div>
  );
}
