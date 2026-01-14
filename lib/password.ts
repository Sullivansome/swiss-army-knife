const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>/?";

export type PasswordOptions = {
  length: number;
  useUppercase: boolean;
  useLowercase: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
};

export function generatePassword(options: PasswordOptions): string {
  const { length, useUppercase, useLowercase, useNumbers, useSymbols } =
    options;
  let pool = "";
  if (useUppercase) pool += UPPER;
  if (useLowercase) pool += LOWER;
  if (useNumbers) pool += NUMBERS;
  if (useSymbols) pool += SYMBOLS;
  if (!pool) return "";

  const bytes = crypto.getRandomValues(new Uint32Array(length));
  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += pool[bytes[i] % pool.length];
  }
  return result;
}
