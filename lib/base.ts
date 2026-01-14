const DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";

export function convertToDecimal(value: string, base: number): bigint {
  if (value.trim() === "") {
    return 0n;
  }
  if (base < 2 || base > 36) {
    throw new Error("Unsupported base");
  }
  const normalized = value.trim().toLowerCase().replace(/_/g, "");
  const isNegative = normalized.startsWith("-");
  const digits = isNegative ? normalized.slice(1) : normalized;
  if (!digits || !/^[0-9a-z]+$/i.test(digits)) {
    throw new Error("Invalid characters for conversion");
  }
  let decimal = 0n;
  for (const char of digits) {
    const digitValue = DIGITS.indexOf(char);
    if (digitValue === -1 || digitValue >= base) {
      throw new Error("Digit outside base range");
    }
    decimal = decimal * BigInt(base) + BigInt(digitValue);
  }
  return isNegative ? -decimal : decimal;
}

export function convertFromDecimal(value: bigint, base: number): string {
  if (base < 2 || base > 36) {
    throw new Error("Unsupported base");
  }
  if (value === 0n) {
    return "0";
  }
  const isNegative = value < 0n;
  let remainder = isNegative ? -value : value;
  let result = "";
  while (remainder > 0n) {
    const digit = Number(remainder % BigInt(base));
    result = DIGITS[digit] + result;
    remainder /= BigInt(base);
  }
  return isNegative ? `-${result}` : result;
}

export function convertBase(
  value: string,
  fromBase: number,
  toBase: number,
): string {
  const decimal = convertToDecimal(value, fromBase);
  return convertFromDecimal(decimal, toBase);
}

export function bigintBitLength(value: bigint): number {
  if (value === 0n) {
    return 1;
  }
  const binary = value < 0n ? (-value).toString(2) : value.toString(2);
  return binary.length;
}

export function padBinary(binaryValue: string, width: number): string {
  const normalized = binaryValue.startsWith("-")
    ? binaryValue.slice(1)
    : binaryValue;
  const padded = normalized.padStart(width, "0");
  return binaryValue.startsWith("-") ? `-${padded}` : padded;
}
