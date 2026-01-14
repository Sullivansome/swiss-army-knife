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
import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";

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
        },
        {
          label: labels.chartTitle,
          data: summary.points.map((point) => point.balance),
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,0.2)",
          tension: 0.3,
        },
      ],
    };
  }, [summary.points, labels.totalContributions, labels.chartTitle]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Field
          label={labels.principal}
          value={principal}
          onChange={setPrincipal}
          min={0}
          step={100}
        />
        <Field
          label={labels.monthly}
          value={monthly}
          onChange={setMonthly}
          min={0}
          step={50}
        />
        <Field
          label={labels.rate}
          value={rate}
          onChange={setRate}
          min={0}
          step={0.1}
        />
        <Field
          label={labels.years}
          value={years}
          onChange={setYears}
          min={1}
          step={1}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Stat
          label={labels.totalContributions}
          value={summary.totalContributions}
          prefix="$"
        />
        <Stat
          label={labels.totalInterest}
          value={summary.totalInterest}
          prefix="$"
        />
      </div>

      <div className="rounded-2xl border bg-card p-4">
        <Line
          data={data}
          options={{
            responsive: true,
            plugins: { legend: { position: "bottom" } },
            scales: { y: { ticks: { callback: (value) => `$${value}` } } },
          }}
        />
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
};

function Field({ label, value, onChange, min, step }: FieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
      />
    </div>
  );
}

type StatProps = {
  label: string;
  value: number;
  prefix?: string;
};

function Stat({ label, value, prefix }: StatProps) {
  return (
    <div className="rounded-xl border bg-card/50 p-4 text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">
        {prefix}
        {value.toLocaleString()}
      </p>
    </div>
  );
}
