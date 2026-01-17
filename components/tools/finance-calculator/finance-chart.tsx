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
import { Line } from "react-chartjs-2";

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

type DataPoint = {
  year: number;
  balance: number;
  contributed: number;
};

type FinanceChartProps = {
  points: DataPoint[];
  contributionsLabel: string;
  balanceLabel: string;
};

export function FinanceChart({
  points,
  contributionsLabel,
  balanceLabel,
}: FinanceChartProps) {
  const data = {
    labels: points.map((point) => `${point.year}`),
    datasets: [
      {
        label: contributionsLabel,
        data: points.map((point) => point.contributed),
        borderColor: "#0ea5e9",
        backgroundColor: "rgba(14,165,233,0.15)",
        tension: 0.3,
        fill: true,
      },
      {
        label: balanceLabel,
        data: points.map((point) => point.balance),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
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
  );
}
