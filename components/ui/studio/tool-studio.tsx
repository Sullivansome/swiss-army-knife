"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

interface ToolStudioProps extends React.HTMLAttributes<HTMLDivElement> {
  layout?: "split" | "vertical";
  children: React.ReactNode;
}

export function ToolStudio({
  children,
  className,
  layout = "split",
  ...props
}: ToolStudioProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        layout === "split" && "lg:grid lg:grid-cols-2 lg:gap-8",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
