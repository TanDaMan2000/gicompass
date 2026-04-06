"use client";

import type { FormEvent } from "react";
import { useMemo, useState, useTransition } from "react";
import {
  assessmentSteps,
  demoScenarios,
  gastroCompassLinks,
  getMissingFields,
  isCompleteAssessment,
} from "@/lib/assessment-config";
import { RadioGroupField } from "@/components/radio-group-field";
import { ResultPanel } from "@/components/result-panel";
import { assessRisk, validateAssessmentInput } from "@/lib/scoring";
import { RiskAssessment, SymptomFormState, SymptomFormValues } from "@/lib/types";

const totalSteps = assessmentSteps.length;

export function SymptomForm() {
  const [values, setValues] = useState<SymptomFormState>({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [result, setResult] = useState<RiskAssessment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const currentStep = assessmentSteps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;
  const allMissingFields = getMissingFields(
    values,
    assessmentSteps.flatMap((step) => step.fields.map((field) => field.key)),
  );

  const completedFieldCount = useMemo(
    () => Object.values(values).filter((value) => value !== undefined).length,
    [values],
  );

  function updateValue(key: keyof SymptomFormValues, value: string) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetToBlank() {
    setValues({});
    setCurrentStepIndex(0);
    setResult(null);
    setError(null);
  }

  function editAssessment() {
    setResult(null);
    setError(null);
    setCurrentStepIndex(totalSteps - 1);
  }

  function getCurrentStepMissingFields() {
    if (currentStep.id === "researchSummary") {
      return [];
    }

    return getMissingFields(values, currentStep.fields.map((field) => field.key));
  }

  function goToNextStep() {
    const missing = getCurrentStepMissingFields();

    if (missing.length > 0) {
      setError(`Please answer: ${missing.join(", ")}.`);
      return;
    }

    setError(null);
    setCurrentStepIndex((index) => Math.min(index + 1, totalSteps - 1));
  }

  function goToPreviousStep() {
    setError(null);
    setCurrentStepIndex((index) => Math.max(index - 1, 0));
  }

  async function runAssessment(nextValues: SymptomFormValues) {
    const validation = validateAssessmentInput(nextValues);

    if (!validation.ok) {
      throw new Error(`Please answer: ${validation.missingFields.join(", ")}.`);
    }

    return assessRisk(validation.values);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isCompleteAssessment(values)) {
      setError(`Please answer: ${allMissingFields.join(", ")}.`);
      return;
    }

    startTransition(() => {
      void (async () => {
        try {
          const assessment = await runAssessment(values);
          setResult(assessment);
        } catch (submissionError) {
          setError(
            submissionError instanceof Error
              ? submissionError.message
              : "Unable to calculate the research summary right now.",
          );
        }
      })();
    });
  }

  function handleScenario(valuesForScenario: SymptomFormValues) {
    setValues(valuesForScenario);
    setError(null);
    startTransition(() => {
      void (async () => {
        try {
          const assessment = await runAssessment(valuesForScenario);
          setResult(assessment);
          setCurrentStepIndex(totalSteps - 1);
        } catch (submissionError) {
          setError(
            submissionError instanceof Error
              ? submissionError.message
              : "Unable to calculate the research summary right now.",
          );
        }
      })();
    });
  }

  if (result && isCompleteAssessment(values)) {
    return (
      <ResultPanel
        result={result}
        values={values}
        onEdit={editAssessment}
        onReset={resetToBlank}
      />
    );
  }

  return (
    <div className="space-y-5">
      <section className="glass-panel animate-fade-up rounded-[32px] p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-primary-dark">
              Demo readiness
            </p>
            <h2 className="font-heading text-2xl font-extrabold text-ink">Run a sample scenario or start blank</h2>
            <p className="max-w-2xl text-sm leading-6 text-muted">
              Use a built-in demo case for judging and live presentation, or step through the intake manually.
            </p>
          </div>
          <button
            type="button"
            onClick={resetToBlank}
            className="rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-semibold text-muted transition hover:border-primary/40 hover:text-primary-dark"
          >
            Start blank
          </button>
        </div>

        <div className="mt-5 grid gap-3 xl:grid-cols-3">
          {demoScenarios.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              onClick={() => handleScenario(scenario.values)}
              className="rounded-[24px] border border-line bg-white/80 p-4 text-left transition hover:border-primary/40 hover:shadow-[0_12px_24px_rgba(21,53,74,0.06)]"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-dark">
                {scenario.label}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">{scenario.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="glass-panel animate-fade-up rounded-[32px] p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-dark">
              Progress
            </p>
            <h2 className="font-heading text-2xl font-extrabold text-ink">
              Step {currentStep.stepNumber} of {totalSteps}
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              {completedFieldCount} of 14 intake fields answered
            </p>
          </div>
          <a
            href={gastroCompassLinks.home}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-semibold text-muted transition hover:border-primary/40 hover:text-primary-dark"
          >
            Back to GastroCompass
          </a>
        </div>

        <div className="mt-5 h-3 rounded-full bg-[rgba(21,53,74,0.08)]">
          <div
            className="h-3 rounded-full bg-[linear-gradient(135deg,#0f6d88,#0f9bb3)] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {assessmentSteps.map((step, index) => {
            const isActive = currentStepIndex === index;
            const isComplete =
              step.fields.length === 0 ||
              getMissingFields(values, step.fields.map((field) => field.key)).length === 0;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStepIndex(index)}
                className={`rounded-[22px] border px-4 py-3 text-left transition ${
                  isActive
                    ? "border-primary-dark bg-[rgba(15,155,179,0.12)]"
                    : "border-line bg-white/70 hover:border-primary/40"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-dark">
                  Step {step.stepNumber}
                </p>
                <p className="mt-1 text-sm font-semibold text-ink">{step.title}</p>
                <p className="mt-2 text-xs leading-5 text-muted">
                  {isComplete ? "Ready" : "Needs input"}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {currentStep.id !== "researchSummary" ? (
          <section className="animate-fade-up rounded-[32px] border border-line bg-white/78 p-6 shadow-soft backdrop-blur sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-dark text-sm font-bold text-white">
                {currentStep.stepNumber}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-dark">
                  {currentStep.helperText}
                </p>
                <h3 className="font-heading text-2xl font-extrabold text-ink">{currentStep.title}</h3>
                <p className="max-w-3xl text-sm leading-6 text-muted">{currentStep.description}</p>
              </div>
            </div>

            <div className="mt-7 grid gap-6">
              {currentStep.fields.map((field) => (
                <RadioGroupField
                  key={field.key}
                  label={field.label}
                  name={field.key}
                  value={values[field.key]}
                  options={field.options}
                  onChange={(value) => updateValue(field.key, value)}
                />
              ))}
            </div>
          </section>
        ) : (
          <section className="animate-fade-up rounded-[32px] border border-line bg-white/78 p-6 shadow-soft backdrop-blur sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-dark text-sm font-bold text-white">
                4
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-dark">
                  Final check before output
                </p>
                <h3 className="font-heading text-2xl font-extrabold text-ink">Review and generate</h3>
                <p className="max-w-3xl text-sm leading-6 text-muted">
                  GastroLens will create a deterministic research summary with section contributions,
                  score drivers, and safety-first follow-up language.
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-4 xl:grid-cols-3">
              {assessmentSteps
                .filter((step) => step.id !== "researchSummary")
                .map((step) => (
                  <div key={step.id} className="rounded-[24px] border border-line bg-white/80 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-dark">
                          Step {step.stepNumber}
                        </p>
                        <h4 className="mt-1 font-heading text-lg font-extrabold text-ink">{step.title}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStepIndex(step.stepNumber - 1)}
                        className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-muted transition hover:border-primary/40 hover:text-primary-dark"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="mt-4 space-y-3">
                      {step.fields.map((field) => (
                        <div key={field.key} className="rounded-2xl border border-line bg-[rgba(244,251,253,0.72)] px-4 py-3">
                          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
                            {field.label}
                          </p>
                          <p className="mt-1 text-sm font-semibold capitalize text-ink">
                            {values[field.key]?.replaceAll("-", " ") || "Missing"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-6 rounded-[24px] border border-line bg-[rgba(244,251,253,0.72)] p-4">
              <p className="text-sm leading-6 text-muted">
                This output is for research-mode interpretation only and does not provide medical diagnosis.
                Full project and research context live on{" "}
                <a
                  href={gastroCompassLinks.research}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary-dark underline decoration-[rgba(15,109,136,0.24)] underline-offset-4"
                >
                  gastrocompass.org
                </a>
                .
              </p>
            </div>

            {allMissingFields.length > 0 ? (
              <div className="mt-4 rounded-[24px] border border-[rgba(214,87,87,0.18)] bg-[rgba(214,87,87,0.08)] p-4">
                <p className="text-sm font-semibold text-high">Before generating, complete these fields:</p>
                <p className="mt-2 text-sm leading-6 text-high">{allMissingFields.join(", ")}.</p>
              </div>
            ) : (
              <div className="mt-4 rounded-[24px] border border-[rgba(31,157,103,0.18)] bg-[rgba(31,157,103,0.08)] p-4">
                <p className="text-sm font-semibold text-low">All required fields are complete.</p>
              </div>
            )}
          </section>
        )}

        <div className="glass-panel animate-fade-up rounded-[32px] p-5 shadow-soft sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-dark">
                Navigation
              </p>
              <p className="mt-1 text-sm leading-6 text-muted">
                Move through the intake or generate the research summary when everything is ready.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={resetToBlank}
                className="rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-semibold text-muted transition hover:border-primary/40 hover:text-primary-dark"
              >
                Reset
              </button>
              {currentStepIndex > 0 ? (
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-semibold text-muted transition hover:border-primary/40 hover:text-primary-dark"
                >
                  Back
                </button>
              ) : null}
              {currentStep.id !== "researchSummary" ? (
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="rounded-full bg-[linear-gradient(135deg,#0f6d88,#0f9bb3)] px-5 py-2.5 text-sm font-bold text-white shadow-glow transition hover:translate-y-[-1px]"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isPending || allMissingFields.length > 0}
                  className="rounded-full bg-[linear-gradient(135deg,#0f6d88,#0f9bb3)] px-5 py-2.5 text-sm font-bold text-white shadow-glow transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPending ? "Generating..." : "Generate research summary"}
                </button>
              )}
            </div>
          </div>

          {error ? <p className="mt-4 text-sm font-medium text-high">{error}</p> : null}
        </div>
      </form>
    </div>
  );
}
