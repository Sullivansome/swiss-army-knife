"use client";

import { useMemo, useState } from "react";

import { calculateTaxBreakdown, splitExpenses } from "@/lib/finance";

export type FinanceEssentialsLabels = {
  tax: {
    title: string;
    amount: string;
    rate: string;
    taxDue: string;
    total: string;
  };
  split: {
    title: string;
    total: string;
    people: string;
    days: string;
    perPerson: string;
    perDay: string;
    perPersonPerDay: string;
    note: string;
  };
};

export function FinanceEssentialsTool({ labels }: { labels: FinanceEssentialsLabels }) {
  const [preTax, setPreTax] = useState("5000");
  const [rate, setRate] = useState("6");
  const [total, setTotal] = useState("2400");
  const [people, setPeople] = useState("4");
  const [days, setDays] = useState("3");

  const taxValues = useMemo(() => {
    const amount = Number(preTax) || 0;
    const rateValue = Number(rate) || 0;
    return calculateTaxBreakdown(amount, rateValue);
  }, [preTax, rate]);

  const splitValues = useMemo(() => {
    const totalValue = Number(total) || 0;
    const peopleValue = Number(people) || 0;
    const dayValue = Number(days) || 0;
    return splitExpenses(totalValue, peopleValue, dayValue);
  }, [total, people, days]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3 rounded-2xl border bg-card px-5 py-6 shadow-sm">
        <p className="text-sm font-semibold text-foreground">{labels.tax.title}</p>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="tax-amount">
            {labels.tax.amount}
          </label>
          <input
            id="tax-amount"
            type="number"
            value={preTax}
            onChange={(event) => setPreTax(event.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="tax-rate">
            {labels.tax.rate}
          </label>
          <input
            id="tax-rate"
            type="number"
            value={rate}
            onChange={(event) => setRate(event.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="rounded-xl border bg-muted/30 px-4 py-3 text-sm">
          <div className="flex items-center justify-between">
            <span>{labels.tax.taxDue}</span>
            <span className="font-semibold">¥{taxValues.tax.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span>{labels.tax.total}</span>
            <span className="font-semibold">¥{taxValues.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border bg-card px-5 py-6 shadow-sm">
        <p className="text-sm font-semibold text-foreground">{labels.split.title}</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="split-total">
              {labels.split.total}
            </label>
            <input
              id="split-total"
              type="number"
              value={total}
              onChange={(event) => setTotal(event.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="split-people">
              {labels.split.people}
            </label>
            <input
              id="split-people"
              type="number"
              value={people}
              onChange={(event) => setPeople(event.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="split-days">
              {labels.split.days}
            </label>
            <input
              id="split-days"
              type="number"
              value={days}
              onChange={(event) => setDays(event.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="rounded-xl border bg-muted/30 px-4 py-3 text-sm">
          <div className="flex items-center justify-between">
            <span>{labels.split.perPerson}</span>
            <span className="font-semibold">¥{splitValues.perPerson.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span>{labels.split.perDay}</span>
            <span className="font-semibold">¥{splitValues.perDay.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span>{labels.split.perPersonPerDay}</span>
            <span className="font-semibold">¥{splitValues.perPersonPerDay.toFixed(2)}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{labels.split.note}</p>
        </div>
      </div>
    </div>
  );
}
