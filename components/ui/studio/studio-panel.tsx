"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

interface StudioPanelProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  contentClassName?: string;
}

export function StudioPanel({
  title,
  actions,
  children,
  className,
  contentClassName,
  ...props
}: StudioPanelProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm transition-all focus-within:ring-1 focus-within:ring-ring/50 hover:border-border/80",
        className,
      )}
      {...props}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between gap-4 px-1">
          {title && (
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </h3>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn("flex-1 min-h-0 relative", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
