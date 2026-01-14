"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
    if (pass) {
      try {
        await navigator.clipboard.writeText(pass);
        toast.success("Copied to clipboard");
      } catch (err) {
        console.error("copy failed", err);
        toast.warning("Copy failed. Please try again.");
      }
    }
  };

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      toast.success("Copied to clipboard");
    } catch (err) {
      console.error("copy failed", err);
      toast.warning("Copy failed. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <NumberField
          label={labels.length}
          value={length}
          min={4}
          max={128}
          onChange={setLength}
        />
        <div className="grid grid-cols-2 gap-3">
          <CheckboxField
            label={labels.uppercase}
            checked={uppercase}
            onChange={setUppercase}
          />
          <CheckboxField
            label={labels.lowercase}
            checked={lowercase}
            onChange={setLowercase}
          />
          <CheckboxField
            label={labels.numbers}
            checked={numbers}
            onChange={setNumbers}
          />
          <CheckboxField
            label={labels.symbols}
            checked={symbols}
            onChange={setSymbols}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="default"
          onClick={handleGenerate}
          disabled={!uppercase && !lowercase && !numbers && !symbols}
        >
          {labels.generate}
        </Button>
        <Button variant="outline" onClick={handleCopy} disabled={!password}>
          {labels.copy}
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          {labels.password}
        </label>
        <input
          type="text"
          readOnly
          value={password}
          placeholder={labels.placeholder}
          className="w-full rounded-lg border bg-muted/50 px-3 py-2 text-sm shadow-inner"
        />
      </div>
    </div>
  );
}

type NumberFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

function NumberField({ label, value, min, max, onChange }: NumberFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground" htmlFor={label}>
        {label}
      </label>
      <input
        id={label}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

function CheckboxField({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-foreground">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-muted-foreground"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}

export default PasswordGeneratorTool;
