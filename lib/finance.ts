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

const CN_NUMS = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"] as const;
const CN_INT_RADICE = ["", "拾", "佰", "仟"] as const;
const CN_INT_UNITS = ["", "万", "亿", "兆"] as const;
const CN_DEC_UNITS = ["角", "分"] as const;
const CN_INTEGER = "整";
const CN_DOLLAR = "元";

export function toChineseUppercase(amountInput: number | string): string {
  const amount = typeof amountInput === "string" ? Number(amountInput) : amountInput;
  if (!Number.isFinite(amount)) {
    throw new Error("Invalid amount");
  }
  if (Math.abs(amount) > 999999999999.99) {
    throw new Error("Amount out of range");
  }
  if (amount === 0) {
    return `零${CN_DOLLAR}${CN_INTEGER}`;
  }

  const value = Math.abs(amount);
  const [integerPartRaw, decimalPartRaw = ""] = value.toFixed(2).split(".");
  const integerPart = parseInt(integerPartRaw, 10);

  let chineseInteger = "";
  if (integerPart > 0) {
    const digits = integerPartRaw.split("").map((digit) => Number(digit));
    let zeroCount = 0;
    for (let i = 0; i < digits.length; i += 1) {
      const position = digits.length - i - 1;
      const unitPos = Math.floor(position / 4);
      const radicePos = position % 4;
      const digit = digits[i]!;
      if (digit === 0) {
        zeroCount += 1;
      } else {
        if (zeroCount > 0) {
          chineseInteger += CN_NUMS[0];
        }
        zeroCount = 0;
        chineseInteger += CN_NUMS[digit] + CN_INT_RADICE[radicePos];
      }
      if (radicePos === 0 && zeroCount < 4) {
        chineseInteger += CN_INT_UNITS[unitPos];
        zeroCount = 0;
      }
    }
  } else {
    chineseInteger = CN_NUMS[0];
  }

  let chineseDecimal = "";
  const decimalDigits = decimalPartRaw.split("").map((digit) => Number(digit));
  for (let i = 0; i < CN_DEC_UNITS.length; i += 1) {
    const digit = decimalDigits[i];
    if (digit !== undefined && digit !== 0) {
      chineseDecimal += CN_NUMS[digit] + CN_DEC_UNITS[i];
    }
  }

  const prefix = amount < 0 ? "负" : "";
  const suffix = chineseDecimal || CN_INTEGER;
  return `${prefix}${chineseInteger}${CN_DOLLAR}${suffix}`;
}

export function calculateTaxBreakdown(amount: number, rate: number) {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const safeRate = Number.isFinite(rate) ? rate : 0;
  const tax = +(safeAmount * (safeRate / 100)).toFixed(2);
  const total = +(safeAmount + tax).toFixed(2);
  return { tax, total };
}

export function splitExpenses(total: number, people: number, days: number) {
  const safeTotal = Number.isFinite(total) ? total : 0;
  const safePeople = Math.max(0, Number.isFinite(people) ? people : 0);
  const safeDays = Math.max(0, Number.isFinite(days) ? days : 0);
  const perPerson = safePeople > 0 ? +(safeTotal / safePeople).toFixed(2) : 0;
  const perDay = safeDays > 0 ? +(safeTotal / safeDays).toFixed(2) : 0;
  const perPersonPerDay = safePeople > 0 && safeDays > 0 ? +(safeTotal / (safePeople * safeDays)).toFixed(2) : 0;
  return { perPerson, perDay, perPersonPerDay };
}
