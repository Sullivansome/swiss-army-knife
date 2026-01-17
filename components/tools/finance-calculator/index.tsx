"use client";

import { Calendar, DollarSign, PiggyBank, TrendingUp } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { WidgetCard, WidgetStat } from "@/components/ui/widget-card";

import { calculateFinanceSummary } from "@/lib/finance";

const FinanceChart = dynamic(
  () => import("./finance-chart").then((mod) => mod.FinanceChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-full animate-pulse rounded-lg bg-muted" />
    ),
  },
);

export type FinanceCalculatorLabels = {
  principal: string;
  monthly: string;
  rate: string;
  years: string;
  totalContributions: string;
  totalInterest: string;
  chartTitle: string;
};

type Props = {
  labels: FinanceCalculatorLabels;
};

export function FinanceCalculatorTool({ labels }: Props) {
  const [principal, setPrincipal] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(10);

  const summary = useMemo(
    () => calculateFinanceSummary(principal, monthly, rate, years),
    [principal, monthly, rate, years],
  );

  return (
    <div className="space-y-8">
      <WidgetCard>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Field
            label={labels.principal}
            value={principal}
            onChange={setPrincipal}
            min={0}
            step={100}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          />
          <Field
            label={labels.monthly}
            value={monthly}
            onChange={setMonthly}
            min={0}
            step={50}
            icon={<PiggyBank className="h-4 w-4 text-muted-foreground" />}
          />
          <Field
            label={labels.rate}
            value={rate}
            onChange={setRate}
            min={0}
            step={0.1}
            suffix="%"
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          />
          <Field
            label={labels.years}
            value={years}
            onChange={setYears}
            min={1}
            step={1}
            suffix="Years"
            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
      </WidgetCard>

      <div className="grid gap-4 md:grid-cols-2">
        <WidgetStat
          label={labels.totalContributions}
          value={`$${summary.totalContributions.toLocaleString()}`}
          icon={<PiggyBank className="h-5 w-5 text-blue-500" />}
          className="bg-blue-500/5 border-blue-200/50 dark:border-blue-900/50"
        />
        <WidgetStat
          label={labels.totalInterest}
          value={`$${summary.totalInterest.toLocaleString()}`}
          icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
          trend={{
            value: Math.round(
              (summary.totalInterest / summary.totalContributions) * 100,
            ),
            isPositive: true,
          }}
          className="bg-emerald-500/5 border-emerald-200/50 dark:border-emerald-900/50"
        />
      </div>

      <WidgetCard className="p-4 sm:p-8">
        <FinanceChart
          points={summary.points}
          contributionsLabel={labels.totalContributions}
          balanceLabel={labels.chartTitle}
        />
      </WidgetCard>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
  icon?: React.ReactNode;
  suffix?: string;
};

function Field({
  label,
  value,
  onChange,
  min,
  step,
  icon,
  suffix,
}: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        {icon}
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          min={min}
          step={step}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full rounded-lg border bg-background px-3 py-2 text-lg font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        {suffix ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default FinanceCalculatorTool;
