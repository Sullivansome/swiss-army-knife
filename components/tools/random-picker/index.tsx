"use client";

import { useCallback, useEffect, useMemo, useReducer } from "react";

import { Button } from "@/components/ui/button";
import {
  createPresetEntries,
  type Entry,
  generateNumberRange,
  loadState,
  parseEntries,
  pickOne,
  type SpinResult,
  saveState,
} from "@/lib/random-picker";

import { Wheel } from "./wheel";

export type RandomPickerLabels = {
  modes: {
    names: string;
    numbers: string;
    quick: string;
  };
  names: {
    input: string;
    placeholder: string;
  };
  numbers: {
    start: string;
    end: string;
    pickCount: string;
  };
  quick: {
    yesno: string;
    coin: string;
    d6: string;
    d20: string;
  };
  wheel: {
    spin: string;
    spinning: string;
    noEntries: string;
  };
  results: {
    title: string;
    clear: string;
    empty: string;
    copy: string;
  };
  fairness: string;
};

type Mode = "names" | "numbers" | "quick";
type QuickPreset = "yesno" | "coin" | "d6" | "d20";

interface State {
  mode: Mode;
  entriesText: string;
  numberStart: number;
  numberEnd: number;
  pickCount: number;
  quickPreset: QuickPreset;
  history: SpinResult[];
}

type Action =
  | { type: "SET_MODE"; mode: Mode }
  | { type: "SET_ENTRIES_TEXT"; text: string }
  | { type: "SET_NUMBER_START"; value: number }
  | { type: "SET_NUMBER_END"; value: number }
  | { type: "SET_PICK_COUNT"; value: number }
  | { type: "SET_QUICK_PRESET"; preset: QuickPreset }
  | { type: "ADD_RESULT"; result: SpinResult }
  | { type: "CLEAR_HISTORY" }
  | { type: "LOAD_STATE"; state: Partial<State> };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.mode };
    case "SET_ENTRIES_TEXT":
      return { ...state, entriesText: action.text };
    case "SET_NUMBER_START":
      return { ...state, numberStart: action.value };
    case "SET_NUMBER_END":
      return { ...state, numberEnd: action.value };
    case "SET_PICK_COUNT":
      return { ...state, pickCount: action.value };
    case "SET_QUICK_PRESET":
      return { ...state, quickPreset: action.preset };
    case "ADD_RESULT":
      return {
        ...state,
        history: [action.result, ...state.history].slice(0, 50),
      };
    case "CLEAR_HISTORY":
      return { ...state, history: [] };
    case "LOAD_STATE":
      return { ...state, ...action.state };
    default:
      return state;
  }
}

const initialState: State = {
  mode: "names",
  entriesText: "",
  numberStart: 1,
  numberEnd: 50,
  pickCount: 1,
  quickPreset: "yesno",
  history: [],
};

interface Props {
  labels: RandomPickerLabels;
}

export function RandomPickerTool({ labels }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const saved = loadState();
    if (saved) {
      dispatch({
        type: "LOAD_STATE",
        state: {
          entriesText: saved.entriesText,
          history: saved.history,
          mode: saved.lastMode,
        },
      });
    }
  }, []);

  useEffect(() => {
    saveState({
      entriesText: state.entriesText,
      history: state.history,
      lastMode: state.mode,
    });
  }, [state.entriesText, state.history, state.mode]);

  const entries = useMemo((): Entry[] => {
    switch (state.mode) {
      case "names":
        return parseEntries(state.entriesText);
      case "numbers":
        return generateNumberRange(state.numberStart, state.numberEnd);
      case "quick":
        return createPresetEntries(state.quickPreset);
      default:
        return [];
    }
  }, [
    state.mode,
    state.entriesText,
    state.numberStart,
    state.numberEnd,
    state.quickPreset,
  ]);

  const handleSpinComplete = useCallback((winner: Entry) => {
    dispatch({
      type: "ADD_RESULT",
      result: { at: Date.now(), entry: winner },
    });
  }, []);

  const copyHistory = useCallback(async () => {
    const text = state.history.map((r) => r.entry.label).join("\n");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard unavailable
    }
  }, [state.history]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {(["names", "numbers", "quick"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => dispatch({ type: "SET_MODE", mode })}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                state.mode === mode
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {labels.modes[mode]}
            </button>
          ))}
        </div>

        {state.mode === "names" && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {labels.names.input}
            </label>
            <textarea
              value={state.entriesText}
              onChange={(e) =>
                dispatch({ type: "SET_ENTRIES_TEXT", text: e.target.value })
              }
              placeholder={labels.names.placeholder}
              className="min-h-48 w-full rounded-lg border bg-background p-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {state.mode === "numbers" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {labels.numbers.start}
              </label>
              <input
                type="number"
                value={state.numberStart}
                onChange={(e) =>
                  dispatch({
                    type: "SET_NUMBER_START",
                    value: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {labels.numbers.end}
              </label>
              <input
                type="number"
                value={state.numberEnd}
                onChange={(e) =>
                  dispatch({
                    type: "SET_NUMBER_END",
                    value: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}

        {state.mode === "quick" && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(["yesno", "coin", "d6", "d20"] as const).map((preset) => (
              <button
                key={preset}
                onClick={() => dispatch({ type: "SET_QUICK_PRESET", preset })}
                className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                  state.quickPreset === preset
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background hover:border-primary/50"
                }`}
              >
                {labels.quick[preset]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-6">
        <Wheel
          entries={entries}
          onSpinComplete={handleSpinComplete}
          labels={labels.wheel}
        />

        <div className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              {labels.results.title}
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyHistory}
                disabled={state.history.length === 0}
              >
                {labels.results.copy}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch({ type: "CLEAR_HISTORY" })}
                disabled={state.history.length === 0}
              >
                {labels.results.clear}
              </Button>
            </div>
          </div>
          <div className="max-h-40 overflow-y-auto rounded-lg border bg-muted/30 p-3">
            {state.history.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                {labels.results.empty}
              </p>
            ) : (
              <ol className="space-y-1 text-sm">
                {state.history.map((result, index) => (
                  <li
                    key={`${result.at}-${index}`}
                    className="flex items-center gap-2"
                  >
                    <span className="w-6 text-right text-muted-foreground">
                      {state.history.length - index}.
                    </span>
                    <span className="font-medium">{result.entry.label}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RandomPickerTool;
