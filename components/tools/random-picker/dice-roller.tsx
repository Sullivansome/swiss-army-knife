"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

type DiceType = "d6" | "d20";
type DiceState = "idle" | "rolling" | "finished";

interface DiceRollerProps {
  diceType: DiceType;
  onRollComplete: (result: number) => void;
  soundEnabled?: boolean;
  labels: {
    roll: string;
    rolling: string;
  };
}

function createRollSound(): () => void {
  let audioContext: AudioContext | null = null;

  return () => {
    try {
      if (!audioContext) {
        audioContext = new AudioContext();
      }

      for (let i = 0; i < 5; i++) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 100 + Math.random() * 200;
        oscillator.type = "square";

        const startTime = audioContext.currentTime + i * 0.08;
        gainNode.gain.setValueAtTime(0.05, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.06);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.06);
      }
    } catch {
      // Audio unavailable
    }
  };
}

function createDiceWinSound(): () => void {
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

      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        800,
        audioContext.currentTime + 0.1,
      );
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.3,
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch {
      // Audio unavailable
    }
  };
}

const defaultLabels = { roll: "Roll", rolling: "Rolling..." };

export function DiceRoller({
  diceType,
  onRollComplete,
  soundEnabled = true,
  labels = defaultLabels,
}: DiceRollerProps) {
  const [state, setState] = useState<DiceState>("idle");
  const [result, setResult] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const diceBoxRef = useRef<unknown>(null);
  const initialized = useRef(false);
  const mountedRef = useRef(true);
  const rollSoundRef = useRef<(() => void) | null>(null);
  const winSoundRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    rollSoundRef.current = createRollSound();
    winSoundRef.current = createDiceWinSound();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || initialized.current) return;

    const initDice = async () => {
      try {
        const DiceBox = (await import("@3d-dice/dice-box")).default;

        const box = new DiceBox("#dice-canvas", {
          assetPath: "/assets/",
          scale: 18,
          theme: "default",
          themeColor: "#3b82f6",
          throwForce: 5,
          spinForce: 4,
          gravity: 1.8,
          enableShadows: true,
          lightIntensity: 1,
        });

        box.onRollComplete = (results: Array<{ value: number }>) => {
          if (!mountedRef.current) return;
          const total = results.reduce((sum, r) => sum + r.value, 0);
          setResult(total);
          setState("finished");
          if (soundEnabled && winSoundRef.current) {
            winSoundRef.current();
          }
          onRollComplete(total);
        };

        await box.init();
        diceBoxRef.current = box;
        initialized.current = true;
      } catch (error) {
        console.error("Failed to initialize dice box:", error);
      }
    };

    initDice();

    return () => {
      if (
        diceBoxRef.current &&
        typeof (diceBoxRef.current as { clear?: () => void }).clear ===
          "function"
      ) {
        (diceBoxRef.current as { clear: () => void }).clear();
      }
    };
  }, [onRollComplete, soundEnabled]);

  const roll = useCallback(() => {
    if (!diceBoxRef.current || state === "rolling") return;

    setState("rolling");
    setResult(null);

    if (soundEnabled && rollSoundRef.current) {
      rollSoundRef.current();
    }

    const notation = diceType === "d6" ? "1d6" : "1d20";
    (diceBoxRef.current as { roll: (notation: string) => void }).roll(notation);
  }, [diceType, state, soundEnabled]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        id="dice-canvas"
        ref={containerRef}
        className="relative h-48 w-full max-w-md overflow-hidden rounded-xl border bg-gradient-to-b from-slate-800 to-slate-950 shadow-lg sm:h-56 [&_canvas]:!h-full [&_canvas]:!w-full"
      />

      <div className="flex w-full items-center justify-center gap-4">
        <Button
          size="lg"
          onClick={roll}
          disabled={state === "rolling"}
          className="h-12 min-w-40 text-lg font-semibold shadow-lg"
        >
          {state === "rolling" ? labels.rolling : labels.roll}
        </Button>
      </div>

      {result !== null && state === "finished" && (
        <output className="mt-2 animate-in fade-in zoom-in-95 rounded-xl border-2 border-primary/20 bg-background/95 px-8 py-4 text-center shadow-xl backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Result
          </span>
          <p className="text-4xl font-black text-primary">{result}</p>
        </output>
      )}
    </div>
  );
}

export default DiceRoller;
