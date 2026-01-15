"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

interface WidgetCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export function WidgetCard({
  title,
  description,
  children,
  className,
  ...props
}: WidgetCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
      {...props}
    >
      {(title || description) && (
        <div className="mb-6 space-y-1">
          {title && (
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

interface WidgetStatProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function WidgetStat({
  label,
  value,
  icon,
  trend,
  className,
}: WidgetStatProps) {
  return (
    <div className={cn("rounded-xl border bg-card/50 p-4", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-2xl font-bold">{value}</p>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-emerald-500" : "text-destructive",
            )}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </span>
        )}
      </div>
    </div>
  );
}
