"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  calculateWheelRotation,
  type Entry,
  generateWheelColors,
  pickOne,
  secureRandomInt,
} from "@/lib/random-picker";

interface WheelProps {
  entries: Entry[];
  onSpinComplete: (winner: Entry) => void;
  spinDuration?: number;
  labels: {
    spin: string;
    spinning: string;
    noEntries: string;
  };
}

type SpinState = "idle" | "spinning" | "finished";

export function Wheel({
  entries,
  onSpinComplete,
  spinDuration = 4000,
  labels,
}: WheelProps) {
  const [spinState, setSpinState] = useState<SpinState>("idle");
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<Entry | null>(null);
  const wheelRef = useRef<SVGSVGElement>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const colors = generateWheelColors(entries.length);

  const spin = useCallback(() => {
    if (entries.length === 0 || spinState === "spinning") return;

    const winnerIndex = secureRandomInt(entries.length);
    const selectedWinner = entries[winnerIndex];
    const targetRotation = calculateWheelRotation(
      winnerIndex,
      entries.length,
      5 + secureRandomInt(3),
    );

    setWinner(null);
    setSpinState("spinning");

    if (reducedMotion.current) {
      setRotation((prev) => prev + targetRotation);
      setWinner(selectedWinner);
      setSpinState("finished");
      onSpinComplete(selectedWinner);
      return;
    }

    setRotation((prev) => prev + targetRotation);

    setTimeout(() => {
      setWinner(selectedWinner);
      setSpinState("finished");
      onSpinComplete(selectedWinner);
    }, spinDuration);
  }, [entries, spinState, spinDuration, onSpinComplete]);

  const createWheelPath = (
    index: number,
    total: number,
    radius: number,
  ): string => {
    if (total === 1) {
      return `M 0 0 m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`;
    }

    const angle = (2 * Math.PI) / total;
    const startAngle = index * angle - Math.PI / 2;
    const endAngle = (index + 1) * angle - Math.PI / 2;

    const x1 = Math.cos(startAngle) * radius;
    const y1 = Math.sin(startAngle) * radius;
    const x2 = Math.cos(endAngle) * radius;
    const y2 = Math.sin(endAngle) * radius;

    const largeArcFlag = angle > Math.PI ? 1 : 0;

    return `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const getLabelPosition = (
    index: number,
    total: number,
    radius: number,
  ): { x: number; y: number; rotation: number } => {
    const angle = (2 * Math.PI) / total;
    const midAngle = (index + 0.5) * angle - Math.PI / 2;
    const labelRadius = radius * 0.65;

    return {
      x: Math.cos(midAngle) * labelRadius,
      y: Math.sin(midAngle) * labelRadius,
      rotation: (midAngle * 180) / Math.PI + 90,
    };
  };

  const truncateLabel = (label: string, maxLength: number = 12): string => {
    if (label.length <= maxLength) return label;
    return label.slice(0, maxLength - 1) + "…";
  };

  if (entries.length === 0) {
    return (
      <div className="flex aspect-square w-full max-w-md items-center justify-center rounded-full border-4 border-dashed border-muted-foreground/30">
        <p className="text-center text-sm text-muted-foreground">
          {labels.noEntries}
        </p>
      </div>
    );
  }

  const radius = 150;
  const viewBox = radius * 2 + 40;
  const center = viewBox / 2;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div
          className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1"
          style={{
            width: 0,
            height: 0,
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderTop: "20px solid hsl(var(--primary))",
          }}
        />

        <svg
          ref={wheelRef}
          viewBox={`0 0 ${viewBox} ${viewBox}`}
          className="h-64 w-64 sm:h-80 sm:w-80"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition:
              spinState === "spinning"
                ? `transform ${spinDuration}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`
                : "none",
          }}
        >
          <g transform={`translate(${center}, ${center})`}>
            {entries.map((entry, index) => (
              <g key={entry.id}>
                <path
                  d={createWheelPath(index, entries.length, radius)}
                  fill={colors[index]}
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={getLabelPosition(index, entries.length, radius).x}
                  y={getLabelPosition(index, entries.length, radius).y}
                  transform={`rotate(${getLabelPosition(index, entries.length, radius).rotation}, ${getLabelPosition(index, entries.length, radius).x}, ${getLabelPosition(index, entries.length, radius).y})`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-white text-[10px] font-semibold drop-shadow-sm sm:text-xs"
                  style={{ pointerEvents: "none" }}
                >
                  {truncateLabel(entry.label)}
                </text>
              </g>
            ))}
            <circle
              r="20"
              fill="white"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
            />
            <circle r="8" fill="hsl(var(--primary))" />
          </g>
        </svg>
      </div>

      <Button
        size="lg"
        onClick={spin}
        disabled={spinState === "spinning" || entries.length === 0}
        className="min-w-32"
      >
        {spinState === "spinning" ? labels.spinning : labels.spin}
      </Button>

      {winner && spinState === "finished" && (
        <div
          className="animate-in fade-in zoom-in-95 rounded-lg border-2 border-primary bg-primary/10 px-6 py-3 text-center duration-300"
          role="alert"
          aria-live="polite"
        >
          <p className="text-lg font-bold text-primary">{winner.label}</p>
        </div>
      )}
    </div>
  );
}

export default Wheel;
