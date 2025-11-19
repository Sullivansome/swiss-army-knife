export type FinancePoint = {
  year: number;
  balance: number;
  contributed: number;
};

export type FinanceSummary = {
  points: FinancePoint[];
  totalContributions: number;
  totalInterest: number;
};

export function calculateFinanceSummary(
  principal: number,
  monthly: number,
  rate: number,
  years: number,
): FinanceSummary {
  const monthlyRate = rate / 100 / 12;
  let balance = principal;
  const points: FinancePoint[] = [];
  const totalMonths = Math.max(1, Math.floor(years * 12));

  for (let month = 1; month <= totalMonths; month += 1) {
    balance = balance * (1 + monthlyRate) + monthly;
    if (month % 12 === 0 || month === totalMonths) {
      const year = Math.ceil(month / 12);
      const contributed = principal + monthly * month;
      points.push({
        year,
        balance: Math.round(balance),
        contributed: Math.round(contributed),
      });
    }
  }

  const totalContributions = Math.round(principal + monthly * totalMonths);
  const totalInterest = Math.max(0, Math.round(balance - totalContributions));

  return { points, totalContributions, totalInterest };
}
