"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

interface StudioToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function StudioToolbar({
  children,
  className,
  ...props
}: StudioToolbarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-lg border bg-muted/40 p-2 mb-6 backdrop-blur supports-[backdrop-filter]:bg-muted/20",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
