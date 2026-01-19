"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { secureRandomInt } from "@/lib/random-picker";

type CoinResult = "heads" | "tails";
type FlipState = "idle" | "flipping" | "finished";

interface CoinFlipProps {
  onFlipComplete: (result: CoinResult) => void;
  labels?: {
    flip: string;
    flipping: string;
    heads: string;
    tails: string;
  };
}

const defaultLabels = {
  flip: "Flip",
  flipping: "Flipping...",
  heads: "Heads",
  tails: "Tails",
};

function createFlipSound(): () => void {
  let audioContext: AudioContext | null = null;

  return () => {
    try {
      if (!audioContext) {
        audioContext = new AudioContext();
      }

      for (let i = 0; i < 8; i++) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 300 + i * 50;
        oscillator.type = "sine";

        const startTime = audioContext.currentTime + i * 0.15;
        gainNode.gain.setValueAtTime(0.08, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.1);
      }
    } catch {
      // Audio unavailable
    }
  };
}

function createResultSound(): () => void {
  let audioContext: AudioContext | null = null;

  return () => {
    try {
      if (!audioContext) {
        audioContext = new AudioContext();
      }

      const frequencies = [440, 554.37, 659.25];

      frequencies.forEach((freq, i) => {
        const oscillator = audioContext!.createOscillator();
        const gainNode = audioContext!.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext!.destination);

        oscillator.frequency.value = freq;
        oscillator.type = "sine";

        const startTime = audioContext!.currentTime + i * 0.08;
        gainNode.gain.setValueAtTime(0.12, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.25);
      });
    } catch {
      // Audio unavailable
    }
  };
}

export function CoinFlip({
  onFlipComplete,
  labels = defaultLabels,
}: CoinFlipProps) {
  const [state, setState] = useState<FlipState>("idle");
  const [result, setResult] = useState<CoinResult>("heads");
  const [displayResult, setDisplayResult] = useState<CoinResult | null>(null);
  const flipSoundRef = useRef<(() => void) | null>(null);
  const resultSoundRef = useRef<(() => void) | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    flipSoundRef.current = createFlipSound();
    resultSoundRef.current = createResultSound();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const flip = useCallback(() => {
    if (state === "flipping") return;

    const newResult: CoinResult = secureRandomInt(2) === 0 ? "heads" : "tails";

    setDisplayResult(null);
    setResult(newResult);
    setState("flipping");

    if (flipSoundRef.current) {
      flipSoundRef.current();
    }

    setTimeout(() => {
      if (!mountedRef.current) return;

      setState("finished");
      setDisplayResult(newResult);

      if (resultSoundRef.current) {
        resultSoundRef.current();
      }

      onFlipComplete(newResult);
    }, 1500);
  }, [state, onFlipComplete]);

  const rotationClass =
    state === "flipping"
      ? result === "heads"
        ? "animate-flip-heads"
        : "animate-flip-tails"
      : "";

  const finalRotation =
    state === "finished"
      ? result === "tails"
        ? "rotateY(180deg)"
        : "rotateY(0deg)"
      : undefined;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="perspective-1000">
        <div
          className={`relative h-32 w-32 transition-transform duration-100 sm:h-40 sm:w-40 ${rotationClass}`}
          style={{
            transformStyle: "preserve-3d",
            transform: finalRotation,
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 text-4xl font-bold text-yellow-900 shadow-lg ring-4 ring-yellow-500/50 sm:text-5xl"
            style={{
              backfaceVisibility: "hidden",
            }}
          >
            👑
          </div>

          <div
            className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-slate-300 via-slate-400 to-slate-600 text-4xl font-bold text-slate-900 shadow-lg ring-4 ring-slate-500/50 sm:text-5xl"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            🦅
          </div>
        </div>
      </div>

      <Button
        size="lg"
        onClick={flip}
        disabled={state === "flipping"}
        className="h-12 min-w-40 text-lg font-semibold shadow-lg"
      >
        {state === "flipping" ? labels.flipping : labels.flip}
      </Button>

      {displayResult && state === "finished" && (
        <div
          className="animate-in fade-in zoom-in-95 rounded-xl border-2 border-primary/20 bg-background/95 px-8 py-4 text-center shadow-xl backdrop-blur duration-300"
          role="alert"
          aria-live="polite"
        >
          <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Result
          </span>
          <p className="text-2xl font-bold text-primary">
            {displayResult === "heads" ? labels.heads : labels.tails}
          </p>
        </div>
      )}

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }

        @keyframes flipToHeads {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(1800deg);
          }
        }

        @keyframes flipToTails {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(1980deg);
          }
        }

        .animate-flip-heads {
          animation: flipToHeads 1.5s ease-out forwards;
        }

        .animate-flip-tails {
          animation: flipToTails 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default CoinFlip;
