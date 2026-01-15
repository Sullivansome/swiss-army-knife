"use client";

import {
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Calendar, DollarSign, PiggyBank, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import { WidgetCard, WidgetStat } from "@/components/ui/widget-card";

import { calculateFinanceSummary } from "@/lib/finance";

let chartRegistered = false;
if (!chartRegistered) {
  Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
  );
  chartRegistered = true;
}

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

  const data = useMemo(() => {
    return {
      labels: summary.points.map((point) => `${point.year}`),
      datasets: [
        {
          label: labels.totalContributions,
          data: summary.points.map((point) => point.contributed),
          borderColor: "#0ea5e9",
          backgroundColor: "rgba(14,165,233,0.15)",
          tension: 0.3,
          fill: true,
        },
        {
          label: labels.chartTitle,
          data: summary.points.map((point) => point.balance),
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,0.1)",
          tension: 0.3,
          fill: true,
        },
      ],
    };
  }, [summary.points, labels.totalContributions, labels.chartTitle]);

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
        <div className="h-[400px] w-full">
          <Line
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top",
                  align: "end",
                  labels: { boxWidth: 10, usePointStyle: true },
                },
                tooltip: {
                  mode: "index",
                  intersect: false,
                  backgroundColor: "rgba(0,0,0,0.8)",
                  padding: 12,
                  cornerRadius: 8,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: "rgba(0,0,0,0.05)" },
                  ticks: {
                    callback: (value) => `$${Number(value).toLocaleString()}`,
                  },
                },
                x: {
                  grid: { display: false },
                },
              },
              interaction: {
                mode: "nearest",
                axis: "x",
                intersect: false,
              },
            }}
          />
        </div>
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
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export default FinanceCalculatorTool;
