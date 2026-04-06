"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { gastroCompassLinks } from "@/lib/assessment-config";
import { RiskAssessment, SymptomFormValues } from "@/lib/types";

const riskStyles = {
  Low: {
    badge: "border-[rgba(31,157,103,0.22)] bg-[rgba(31,157,103,0.14)] text-low",
    accent: "from-[rgba(31,157,103,0.16)] via-[rgba(255,255,255,0.82)] to-white/72",
  },
  Moderate: {
    badge: "border-[rgba(209,161,40,0.3)] bg-[rgba(209,161,40,0.2)] text-moderate",
    accent: "from-[rgba(245,191,36,0.3)] via-[rgba(255,248,214,0.88)] to-white/72",
  },
  High: {
    badge: "border-[rgba(214,87,87,0.3)] bg-[rgba(214,87,87,0.18)] text-high",
    accent: "from-[rgba(214,87,87,0.28)] via-[rgba(255,230,230,0.88)] to-white/72",
  },
} as const;

const groupedSnapshot: {
  title: string;
  keys: (keyof SymptomFormValues)[];
}[] = [
  {
    title: "Core symptoms",
    keys: ["rectalBleeding", "bowelChange", "abdominalPain", "fatigue", "duration"],
  },
  {
    title: "Additional pattern",
    keys: [
      "weightLoss",
      "appetiteChange",
      "stoolUrgency",
      "nightSymptoms",
      "nauseaVomiting",
      "impactDailyLife",
    ],
  },
  {
    title: "Risk context",
    keys: ["familyHistory", "ageGroup", "priorEvaluation"],
  },
];

const fieldTitles: Record<keyof SymptomFormValues, string> = {
  rectalBleeding: "Rectal bleeding",
  bowelChange: "Bowel habits",
  abdominalPain: "Abdominal pain",
  fatigue: "Fatigue",
  duration: "Duration",
  weightLoss: "Weight loss",
  appetiteChange: "Appetite change",
  stoolUrgency: "Stool urgency",
  nightSymptoms: "Night symptoms",
  nauseaVomiting: "Nausea or vomiting",
  impactDailyLife: "Daily-life impact",
  familyHistory: "Family history",
  ageGroup: "Age group",
  priorEvaluation: "Prior evaluation",
};

type ResultPanelProps = {
  result: RiskAssessment;
  values: SymptomFormValues;
  onEdit: () => void;
  onReset: () => void;
};

type ResultTab = "summary" | "snapshot" | "share";

function PanelCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[28px] border border-line bg-white/82 p-5 shadow-[0_12px_30px_rgba(21,53,74,0.05)]">
      <h3 className="font-heading text-lg font-extrabold text-ink">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function ResultPanel({ result, values, onEdit, onReset }: ResultPanelProps) {
  const [tab, setTab] = useState<ResultTab>("summary");
  const [isJudgeMode, setIsJudgeMode] = useState(false);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const style = riskStyles[result.risk];

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(result.shareSummary);
      setCopyMessage("Demo summary copied.");
    } catch {
      setCopyMessage("Unable to copy summary on this browser.");
    }
  }

  function printSummary() {
    window.print();
  }

  const tabs: { id: ResultTab; label: string }[] = [
    { id: "summary", label: "Summary" },
    { id: "snapshot", label: "Snapshot" },
    { id: "share", label: "Share view" },
  ];

  return (
    <section className="animate-fade-up space-y-5">
      <div className={`rounded-[32px] border border-white/70 bg-gradient-to-br ${style.accent} p-6 shadow-soft backdrop-blur sm:p-7`}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary-dark">
              Step 4 · Research summary
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-heading text-4xl font-extrabold text-ink sm:text-5xl">
                {result.risk} flag
              </h2>
              <span className={`rounded-full border px-4 py-2 text-sm font-bold ${style.badge}`}>
                Total score {result.score}
              </span>
            </div>
            <p className="max-w-4xl text-base leading-7 text-muted">{result.explanation}</p>
          </div>

          <div className="grid gap-3 sm:min-w-[280px]">
            <div className="rounded-[24px] border border-white/70 bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-dark">Pattern lens</p>
              <p className="mt-2 text-sm font-semibold text-ink">{result.patternLens}</p>
            </div>
            <div className="rounded-[24px] border border-white/70 bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-dark">Why it happened</p>
              <p className="mt-2 text-sm leading-6 text-ink">{result.driverSummary}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[24px] border border-white/70 bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-dark">Follow-up-oriented summary</p>
            <p className="mt-2 text-sm leading-6 text-ink">{result.followUpSummary}</p>
          </div>
          <div className="rounded-[24px] border border-white/70 bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-dark">Safety note</p>
            <p className="mt-2 text-sm leading-6 text-ink">{result.safetyNote}</p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-[28px] p-4 shadow-soft sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {tabs.map((item) => {
              const isActive = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-primary-dark bg-[rgba(15,155,179,0.12)] text-primary-dark"
                      : "border-line bg-white/80 text-muted hover:border-primary/40 hover:text-primary-dark"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-3 rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-semibold text-muted">
              <input
                type="checkbox"
                checked={isJudgeMode}
                onChange={(event) => setIsJudgeMode(event.target.checked)}
                className="h-4 w-4 accent-[#0f9bb3]"
              />
              Judge / Research Mode
            </label>
            <button
              type="button"
              onClick={onEdit}
              className="rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-semibold text-muted transition hover:border-primary/40 hover:text-primary-dark"
            >
              Edit intake
            </button>
          </div>
        </div>
      </div>

      {tab === "summary" ? (
        <div className="grid gap-5 xl:grid-cols-[1.12fr_0.88fr]">
          <div className="space-y-5">
            <PanelCard title="Section contributions">
              <div className="grid gap-3 lg:grid-cols-3">
                {result.sectionContributions.map((section) => (
                  <div key={section.id} className="rounded-[22px] border border-line bg-[rgba(244,251,253,0.72)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-dark">{section.label}</p>
                    <p className="mt-2 font-heading text-3xl font-extrabold text-ink">{section.score}</p>
                    <p className="mt-2 text-sm leading-6 text-muted">{section.summary}</p>
                  </div>
                ))}
              </div>
            </PanelCard>

            <PanelCard title="What drove the result">
              <div className="space-y-3">
                {result.scoreBreakdown.length > 0 ? (
                  result.scoreBreakdown.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-line bg-[rgba(244,251,253,0.72)] px-4 py-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-ink">{item.label}</p>
                          <p className="mt-1 text-sm leading-6 text-muted">{item.rationale}</p>
                        </div>
                        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${style.badge}`}>
                          +{item.points}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-6 text-muted">
                    No higher-weighted symptom or context rules were triggered in this run.
                  </p>
                )}
              </div>
            </PanelCard>
          </div>

          <div className="space-y-5">
            <PanelCard title="Website handoff">
              <p className="text-sm leading-6 text-muted">
                GastroLens is the interactive tool layer. The broader project story, research framing,
                and public-facing ecosystem live on GastroCompass.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={gastroCompassLinks.home}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[linear-gradient(135deg,#0f6d88,#0f9bb3)] px-4 py-2 text-sm font-bold text-white shadow-glow"
                >
                  Back to GastroCompass
                </a>
                <a
                  href={gastroCompassLinks.research}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-muted transition hover:border-primary/40 hover:text-primary-dark"
                >
                  Learn more about the research
                </a>
              </div>
            </PanelCard>

            <PanelCard title="Safety-first reminder">
              <p className="text-sm leading-6 text-muted">
                GastroLens is a deterministic research-mode tool. It is not a diagnosis and should not
                replace clinician judgment, testing, or emergency care.
              </p>
            </PanelCard>

            {isJudgeMode ? (
              <>
                <PanelCard title="Interaction bonuses">
                  <div className="space-y-3">
                    {result.interactionBreakdown.length > 0 ? (
                      result.interactionBreakdown.map((item) => (
                        <div key={item.label} className="rounded-2xl border border-line bg-[rgba(244,251,253,0.72)] px-4 py-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-ink">{item.label}</p>
                              <p className="mt-1 text-sm leading-6 text-muted">{item.rationale}</p>
                            </div>
                            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${style.badge}`}>
                              +{item.points}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm leading-6 text-muted">
                        No interaction bonuses fired in this run.
                      </p>
                    )}
                  </div>
                </PanelCard>

                <PanelCard title="Validation notes">
                  <div className="space-y-3">
                    {result.validationNotes.length > 0 ? (
                      result.validationNotes.map((note) => (
                        <div key={note.message} className="rounded-2xl border border-line bg-[rgba(244,251,253,0.72)] px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-dark">
                            {note.level}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-muted">{note.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm leading-6 text-muted">
                        No validation or contradiction notes were triggered in this run.
                      </p>
                    )}
                  </div>
                </PanelCard>

                <PanelCard title="Why rule-based logic">
                  <p className="text-sm leading-6 text-muted">{result.ruleLogicNote}</p>
                </PanelCard>
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      {tab === "snapshot" ? (
        <PanelCard title="Assessment snapshot">
          <div className="space-y-5">
            {groupedSnapshot.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-dark">
                  {group.title}
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {group.keys.map((key) => (
                    <div key={key} className="rounded-[22px] border border-line bg-[rgba(244,251,253,0.72)] px-4 py-3">
                      <p className="text-sm font-medium text-muted">{fieldTitles[key]}</p>
                      <p className="mt-2 break-words text-base font-semibold capitalize text-ink">
                        {String(values[key]).replaceAll("-", " ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </PanelCard>
      ) : null}

      {tab === "share" ? (
        <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
          <PanelCard title="Demo summary view">
            <div className="rounded-[24px] border border-line bg-[rgba(244,251,253,0.72)] p-5">
              <pre className="whitespace-pre-wrap text-sm leading-7 text-ink">{result.shareSummary}</pre>
            </div>
          </PanelCard>

          <div className="space-y-5">
            <PanelCard title="Presentation actions">
              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={copySummary}
                  className="rounded-full bg-[linear-gradient(135deg,#0f6d88,#0f9bb3)] px-4 py-2.5 text-sm font-bold text-white shadow-glow"
                >
                  Copy summary
                </button>
                <button
                  type="button"
                  onClick={printSummary}
                  className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-muted transition hover:border-primary/40 hover:text-primary-dark"
                >
                  Print summary
                </button>
                {copyMessage ? <p className="text-sm text-muted">{copyMessage}</p> : null}
              </div>
            </PanelCard>

            {isJudgeMode ? (
              <PanelCard title="Research mode extras">
                <div className="space-y-3">
                  {result.dampeners.length > 0 ? (
                    result.dampeners.map((item) => (
                      <div key={item.label} className="rounded-2xl border border-line bg-[rgba(244,251,253,0.72)] px-4 py-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-ink">{item.label}</p>
                            <p className="mt-1 text-sm leading-6 text-muted">{item.rationale}</p>
                          </div>
                          <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-bold text-muted">
                            {item.points}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm leading-6 text-muted">
                      No dampener rules were applied in this run.
                    </p>
                  )}
                </div>
              </PanelCard>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onReset}
          className="rounded-full bg-[linear-gradient(135deg,#0f6d88,#0f9bb3)] px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:translate-y-[-1px]"
        >
          Start a new assessment
        </button>
        <a
          href={gastroCompassLinks.research}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-line bg-white/80 px-5 py-3 text-sm font-semibold text-muted transition hover:border-primary/40 hover:text-primary-dark"
        >
          Learn more about the research
        </a>
      </div>
    </section>
  );
}
