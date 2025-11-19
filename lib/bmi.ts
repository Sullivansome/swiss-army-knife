export type BmiCategory = "underweight" | "normal" | "overweight" | "obese";

export function calculateBmi(heightCm: number, weightKg: number): { bmi: number; category: BmiCategory } {
  if (heightCm <= 0 || weightKg <= 0) {
    return { bmi: 0, category: "normal" };
  }
  const meters = heightCm / 100;
  const bmi = weightKg / (meters * meters);
  return { bmi, category: getCategory(bmi) };
}

function getCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}
