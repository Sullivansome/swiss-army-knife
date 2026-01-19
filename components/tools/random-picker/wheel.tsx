"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Wheel as SpinWheel } from "spin-wheel";

import { Button } from "@/components/ui/button";
import { type Entry, secureRandomInt } from "@/lib/random-picker";

interface WheelProps {
  entries: Entry[];
  onSpinComplete: (winner: Entry) => void;
  spinDuration?: number;
  soundEnabled?: boolean;
  labels: {
    spin: string;
    spinning: string;
    noEntries: string;
  };
}

type SpinState = "idle" | "spinning" | "finished";

const WHEEL_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#F8B500",
  "#00CED1",
  "#FF69B4",
  "#32CD32",
  "#FF8C00",
];

function createTickSound(): () => void {
  let audioContext: AudioContext | null = null;

  return () => {
    try {
      if (!audioContext) {
        audioContext = new AudioContext();
      }
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.05,
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    } catch {
      // Audio not available
    }
  };
}

function createWinSound(): () => void {
  let audioContext: AudioContext | null = null;

  return () => {
    try {
      if (!audioContext) {
        audioContext = new AudioContext();
      }
      const frequencies = [523.25, 659.25, 783.99, 1046.5];

      frequencies.forEach((freq, i) => {
        const oscillator = audioContext!.createOscillator();
        const gainNode = audioContext!.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext!.destination);

        oscillator.frequency.value = freq;
        oscillator.type = "sine";

        const startTime = audioContext!.currentTime + i * 0.1;
        gainNode.gain.setValueAtTime(0.15, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.3);
      });
    } catch {
      // Audio not available
    }
  };
}

export function Wheel({
  entries,
  onSpinComplete,
  spinDuration = 4000,
  soundEnabled = true,
  labels,
}: WheelProps) {
  const [spinState, setSpinState] = useState<SpinState>("idle");
  const [winner, setWinner] = useState<Entry | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<SpinWheel | null>(null);
  const lastSegmentRef = useRef<number>(-1);
  const tickSoundRef = useRef<(() => void) | null>(null);
  const winSoundRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    tickSoundRef.current = createTickSound();
    winSoundRef.current = createWinSound();
  }, []);

  useEffect(() => {
    if (!containerRef.current || entries.length === 0) {
      if (wheelRef.current) {
        wheelRef.current.remove();
        wheelRef.current = null;
      }
      return;
    }

    const items = entries.map((entry, index) => ({
      label:
        entry.label.length > 15 ? entry.label.slice(0, 14) + "…" : entry.label,
      backgroundColor: WHEEL_COLORS[index % WHEEL_COLORS.length],
      labelColor: "#ffffff",
    }));

    if (wheelRef.current) {
      wheelRef.current.items = items;
    } else {
      wheelRef.current = new SpinWheel(containerRef.current, {
        items,
        itemLabelRadius: 0.88,
        itemLabelRadiusMax: 0.35,
        itemLabelFont: "Geist, sans-serif",
        itemLabelFontSizeMax: 20,
        itemLabelAlign: "right",
        itemBackgroundColors: WHEEL_COLORS,
        rotationSpeedMax: 1000,
        rotationResistance: -70,
        radius: 0.95,
        borderColor: "#ffffff",
        borderWidth: 2,
        lineColor: "#ffffff",
        lineWidth: 1,
        pointerAngle: 90,
        isInteractive: false,
        onRest: (event: { currentIndex: number }) => {
          const winnerEntry = entries[event.currentIndex];
          if (winnerEntry) {
            setWinner(winnerEntry);
            setSpinState("finished");
            if (soundEnabled && winSoundRef.current) {
              winSoundRef.current();
            }
            onSpinComplete(winnerEntry);
          }
        },
      });
    }

    return () => {
      if (wheelRef.current) {
        wheelRef.current.remove();
        wheelRef.current = null;
      }
    };
  }, [entries, onSpinComplete, soundEnabled]);

  useEffect(() => {
    if (spinState !== "spinning" || !soundEnabled) return;

    const checkSegment = () => {
      if (!wheelRef.current || spinState !== "spinning") return;

      const rotation =
        (wheelRef.current as unknown as { rotation: number }).rotation || 0;
      const segmentAngle = 360 / entries.length;
      const currentSegment = Math.floor(
        (((rotation % 360) + 360) % 360) / segmentAngle,
      );

      if (currentSegment !== lastSegmentRef.current) {
        lastSegmentRef.current = currentSegment;
        if (tickSoundRef.current) {
          tickSoundRef.current();
        }
      }
    };

    const intervalId = setInterval(checkSegment, 50);
    return () => clearInterval(intervalId);
  }, [spinState, entries.length, soundEnabled]);

  const spin = useCallback(() => {
    if (!wheelRef.current || entries.length === 0 || spinState === "spinning")
      return;

    const winnerIndex = secureRandomInt(entries.length);
    setWinner(null);
    setSpinState("spinning");
    lastSegmentRef.current = -1;

    wheelRef.current.spinToItem(winnerIndex, spinDuration, true, 2, 1);
  }, [entries, spinState, spinDuration]);

  if (entries.length === 0) {
    return (
      <div className="flex aspect-square w-full max-w-xs items-center justify-center rounded-full border-4 border-dashed border-muted-foreground/30">
        <p className="text-center text-sm text-muted-foreground">
          {labels.noEntries}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-1"
          style={{
            width: 0,
            height: 0,
            borderTop: "12px solid transparent",
            borderBottom: "12px solid transparent",
            borderRight: "20px solid hsl(var(--primary))",
          }}
        />
        <div ref={containerRef} className="h-64 w-64 sm:h-80 sm:w-80" />
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
