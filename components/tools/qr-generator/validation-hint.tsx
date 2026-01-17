"use client";

import { AlertCircle } from "lucide-react";

interface ValidationHintProps {
  message?: string;
  show: boolean;
}

export function ValidationHint({ message, show }: ValidationHintProps) {
  if (!show || !message) {
    return null;
  }

  return (
    <div className="flex items-center gap-1.5 mt-1.5 text-destructive">
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      <span className="text-xs">{message}</span>
    </div>
  );
}

export default ValidationHint;
