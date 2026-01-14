"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  type RelationResult,
  type RelationStep,
  relationSteps,
  resolveRelation,
} from "@/lib/family-relation";

export type FamilyRelationLabels = {
  stepPlaceholder: string;
  addStep: string;
  undo: string;
  clear: string;
  stepsLabel: string;
  empty: string;
  resultLabel: string;
  unknown: string;
  selfLabel: string;
  resultHint: string;
  steps: Record<RelationStep, string>;
  results: Record<RelationResult, string>;
};

type Props = {
  labels: FamilyRelationLabels;
};

export function FamilyRelationCalculator({ labels }: Props) {
  const [selectedSteps, setSelectedSteps] = useState<RelationStep[]>([]);
  const [currentStep, setCurrentStep] = useState<RelationStep>(
    relationSteps[0],
  );

  const resultKey = resolveRelation(selectedSteps);

  const result = useMemo(() => {
    if (resultKey) {
      return labels.results[resultKey];
    }
    if (selectedSteps.length === 0) {
      return labels.empty;
    }
    return labels.unknown;
  }, [resultKey, selectedSteps.length, labels]);

  function handleAddStep() {
    setSelectedSteps((prev) => [...prev, currentStep]);
  }

  function undoLast() {
    setSelectedSteps((prev) => prev.slice(0, -1));
  }

  function clearSteps() {
    setSelectedSteps([]);
  }

  const renderedPath = [
    labels.selfLabel,
    ...selectedSteps.map((step) => labels.steps[step]),
  ].join(" → ");

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor="relation-step"
          >
            {labels.stepPlaceholder}
          </label>
          <div className="flex gap-2">
            <select
              id="relation-step"
              value={currentStep}
              onChange={(event) =>
                setCurrentStep(event.target.value as RelationStep)
              }
              className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm"
            >
              {relationSteps.map((step) => (
                <option key={step} value={step}>
                  {labels.steps[step]}
                </option>
              ))}
            </select>
            <Button type="button" onClick={handleAddStep} className="shrink-0">
              {labels.addStep}
            </Button>
          </div>
        </div>
        <div className="flex items-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={selectedSteps.length === 0}
            onClick={undoLast}
            className="flex-1"
          >
            {labels.undo}
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={selectedSteps.length === 0}
            onClick={clearSteps}
            className="flex-1"
          >
            {labels.clear}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">
          {labels.stepsLabel}
        </p>
        <div className="rounded-xl border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          {selectedSteps.length === 0 ? labels.empty : renderedPath}
        </div>
      </div>

      <div className="rounded-2xl border bg-card px-5 py-6 shadow-sm">
        <p className="text-sm font-semibold text-foreground">
          {labels.resultLabel}
        </p>
        <p className="text-xs text-muted-foreground">{labels.resultHint}</p>
        <p className="mt-2 text-2xl font-semibold text-foreground">{result}</p>
      </div>
    </div>
  );
}

export default FamilyRelationCalculator;
