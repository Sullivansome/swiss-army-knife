export type RelationStep =
  | "father"
  | "mother"
  | "olderBrother"
  | "youngerBrother"
  | "olderSister"
  | "youngerSister"
  | "son"
  | "daughter"
  | "husband"
  | "wife";

export type RelationResult =
  | "father"
  | "mother"
  | "paternalGrandfather"
  | "paternalGrandmother"
  | "maternalGrandfather"
  | "maternalGrandmother"
  | "paternalUncle"
  | "paternalAunt"
  | "maternalUncle"
  | "maternalAunt"
  | "elderBrother"
  | "youngerBrother"
  | "elderSister"
  | "youngerSister"
  | "son"
  | "daughter"
  | "grandson"
  | "granddaughter"
  | "nephew"
  | "niece"
  | "fatherInLaw"
  | "motherInLaw"
  | "brotherInLaw"
  | "sisterInLaw"
  | "husband"
  | "wife"
  | "daughterInLaw"
  | "sonInLaw"
  | "cousin";

export const relationSteps: RelationStep[] = [
  "father",
  "mother",
  "olderBrother",
  "youngerBrother",
  "olderSister",
  "youngerSister",
  "son",
  "daughter",
  "husband",
  "wife",
];

const relationMap: Record<string, RelationResult> = {
  father: "father",
  mother: "mother",
  "father>father": "paternalGrandfather",
  "father>mother": "paternalGrandmother",
  "mother>father": "maternalGrandfather",
  "mother>mother": "maternalGrandmother",
  "father>olderBrother": "paternalUncle",
  "father>youngerBrother": "paternalUncle",
  "father>olderSister": "paternalAunt",
  "father>youngerSister": "paternalAunt",
  "mother>olderBrother": "maternalUncle",
  "mother>youngerBrother": "maternalUncle",
  "mother>olderSister": "maternalAunt",
  "mother>youngerSister": "maternalAunt",
  olderBrother: "elderBrother",
  youngerBrother: "youngerBrother",
  olderSister: "elderSister",
  youngerSister: "youngerSister",
  "olderBrother>son": "nephew",
  "youngerBrother>son": "nephew",
  "olderBrother>daughter": "niece",
  "youngerBrother>daughter": "niece",
  "olderSister>son": "nephew",
  "youngerSister>son": "nephew",
  "olderSister>daughter": "niece",
  "youngerSister>daughter": "niece",
  son: "son",
  daughter: "daughter",
  "son>son": "grandson",
  "son>daughter": "granddaughter",
  "daughter>son": "grandson",
  "daughter>daughter": "granddaughter",
  "father>olderBrother>son": "cousin",
  "father>youngerBrother>son": "cousin",
  "father>olderBrother>daughter": "cousin",
  "father>youngerBrother>daughter": "cousin",
  "father>olderSister>son": "cousin",
  "father>olderSister>daughter": "cousin",
  "mother>olderBrother>son": "cousin",
  "mother>olderBrother>daughter": "cousin",
  "mother>olderSister>son": "cousin",
  "mother>olderSister>daughter": "cousin",
  husband: "husband",
  wife: "wife",
  "husband>mother": "motherInLaw",
  "husband>father": "fatherInLaw",
  "wife>mother": "motherInLaw",
  "wife>father": "fatherInLaw",
  "husband>olderBrother": "brotherInLaw",
  "husband>youngerBrother": "brotherInLaw",
  "husband>olderSister": "sisterInLaw",
  "husband>youngerSister": "sisterInLaw",
  "wife>olderBrother": "brotherInLaw",
  "wife>youngerBrother": "brotherInLaw",
  "wife>olderSister": "sisterInLaw",
  "wife>youngerSister": "sisterInLaw",
  "olderBrother>wife": "sisterInLaw",
  "youngerBrother>wife": "sisterInLaw",
  "olderSister>husband": "brotherInLaw",
  "youngerSister>husband": "brotherInLaw",
  "son>wife": "daughterInLaw",
  "daughter>husband": "sonInLaw",
};

export function resolveRelation(steps: RelationStep[]): RelationResult | null {
  if (steps.length === 0) {
    return null;
  }
  const key = steps.join(">" as const);
  return relationMap[key] ?? null;
}
