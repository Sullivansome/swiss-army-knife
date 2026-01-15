"use client";

import type { VariantProps } from "class-variance-authority";
import { Check, Copy } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button, type buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  value: string;
  label?: string;
  successMessage?: string;
  asChild?: boolean;
}

export function CopyButton({
  value,
  className,
  variant = "outline",
  size = "icon",
  label,
  successMessage = "Copied to clipboard",
  asChild = false,
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (hasCopied) {
      const timeout = setTimeout(() => {
        setHasCopied(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [hasCopied]);

  const copyToClipboard = React.useCallback(() => {
    if (!value) return;

    navigator.clipboard.writeText(value);
    setHasCopied(true);
    toast.success(successMessage);
  }, [value, successMessage]);

  if (label) {
    return (
      <Button
        variant={variant}
        size="sm"
        className={cn("gap-2", className)}
        onClick={copyToClipboard}
        {...props}
      >
        {hasCopied ? (
          <Check className="h-4 w-4 text-emerald-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        <span>{label}</span>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("h-8 w-8", className)}
      onClick={copyToClipboard}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? (
        <Check className="h-4 w-4 text-emerald-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
}
