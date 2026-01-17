"use client";

import { RefreshCw, Settings, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { WidgetCard } from "@/components/ui/widget-card";
import { generatePassword } from "@/lib/password";

type Props = {
  labels: {
    length: string;
    uppercase: string;
    lowercase: string;
    numbers: string;
    symbols: string;
    generate: string;
    copy: string;
    password: string;
    placeholder: string;
  };
};

export function PasswordGeneratorTool({ labels }: Props) {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [password, setPassword] = useState("");

  const handleGenerate = async () => {
    const pass = generatePassword({
      length,
      useUppercase: uppercase,
      useLowercase: lowercase,
      useNumbers: numbers,
      useSymbols: symbols,
    });
    setPassword(pass);

    // Auto-copy to clipboard
    try {
      await navigator.clipboard.writeText(pass);
      toast.success("Password copied to clipboard");
    } catch {
      // Clipboard API may fail in some contexts, silently ignore
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <WidgetCard className="bg-primary/5 border-primary/20">
        <div className="flex flex-col items-center gap-6 text-center py-6">
          <div className="space-y-2 w-full">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Generated Password
            </p>
            <div className="relative group">
              <div className="min-h-[64px] w-full rounded-2xl bg-background border-2 border-primary/20 p-4 text-3xl font-mono font-medium tracking-tight break-all flex items-center justify-center shadow-sm">
                {password || (
                  <span className="text-muted-foreground/30">...</span>
                )}
              </div>
              {password && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyButton value={password} />
                </div>
              )}
            </div>
          </div>

          <Button
            size="lg"
            onClick={handleGenerate}
            className="w-full sm:w-auto min-w-[200px] h-12 text-lg shadow-lg shadow-primary/20"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            {labels.generate}
          </Button>
        </div>
      </WidgetCard>

      <WidgetCard title="Configuration" className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              {labels.length}
            </label>
            <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded font-medium">
              {length}
            </span>
          </div>
          <input
            type="range"
            min={4}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CheckboxTile
            label={labels.uppercase}
            checked={uppercase}
            onChange={setUppercase}
            example="ABC"
          />
          <CheckboxTile
            label={labels.lowercase}
            checked={lowercase}
            onChange={setLowercase}
            example="abc"
          />
          <CheckboxTile
            label={labels.numbers}
            checked={numbers}
            onChange={setNumbers}
            example="123"
          />
          <CheckboxTile
            label={labels.symbols}
            checked={symbols}
            onChange={setSymbols}
            example="@#$"
          />
        </div>
      </WidgetCard>
    </div>
  );
}

function CheckboxTile({
  label,
  checked,
  onChange,
  example,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  example: string;
}) {
  return (
    <label
      className={`
         flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all
         ${checked ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20" : "border-border bg-card hover:bg-muted/50"}
      `}
    >
      <div className="flex items-center gap-3">
        <div
          className={`
               flex items-center justify-center w-5 h-5 rounded border transition-colors
               ${checked ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30 bg-background"}
            `}
        >
          {checked && <ShieldCheck className="h-3.5 w-3.5" />}
        </div>
        <span className="font-medium text-sm">{label}</span>
      </div>
      <span className="text-xs text-muted-foreground font-mono bg-background/50 px-1.5 py-0.5 rounded border border-border/50">
        {example}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
      />
    </label>
  );
}

export default PasswordGeneratorTool;
