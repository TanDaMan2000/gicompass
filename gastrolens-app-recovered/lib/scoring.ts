import { allAssessmentFields, fieldLabels, gastroCompassLinks, isCompleteAssessment } from "@/lib/assessment-config";
import {
  AssessmentSectionId,
  RiskAssessment,
  RiskLevel,
  ScoreContribution,
  SectionContribution,
  SymptomFormState,
  SymptomFormValues,
  ValidationNote,
} from "@/lib/types";

type Rule = {
  label: string;
  points: number;
  sectionId: AssessmentSectionId | "interaction";
  kind: ScoreContribution["kind"];
  rationale: string;
  matches: (values: SymptomFormValues) => boolean;
};

const scoringRules: Rule[] = [
  {
    label: "Occasional rectal bleeding",
    points: 1,
    sectionId: "core",
    kind: "base",
    rationale: "Bleeding raises the signal even before it becomes persistent.",
    matches: (values) => values.rectalBleeding === "occasional",
  },
  {
    label: "Persistent rectal bleeding",
    points: 3,
    sectionId: "core",
    kind: "base",
    rationale: "Persistence is one of the strongest direct warning-sign weights in the model.",
    matches: (values) => values.rectalBleeding === "persistent",
  },
  {
    label: "Mild bowel-habit change",
    points: 1,
    sectionId: "core",
    kind: "base",
    rationale: "Even a mild bowel-pattern change contributes when combined with other features.",
    matches: (values) => values.bowelChange === "mild",
  },
  {
    label: "Significant bowel-habit change",
    points: 2,
    sectionId: "core",
    kind: "base",
    rationale: "A stronger bowel-pattern shift adds meaningful weight to the overall flag.",
    matches: (values) => values.bowelChange === "significant",
  },
  {
    label: "Mild abdominal pain",
    points: 1,
    sectionId: "core",
    kind: "base",
    rationale: "Pain contributes modestly when present but not severe.",
    matches: (values) => values.abdominalPain === "mild",
  },
  {
    label: "Severe abdominal pain",
    points: 2,
    sectionId: "core",
    kind: "base",
    rationale: "Severe pain signals a stronger symptom burden.",
    matches: (values) => values.abdominalPain === "severe",
  },
  {
    label: "Severe fatigue",
    points: 1,
    sectionId: "core",
    kind: "base",
    rationale: "Severe fatigue adds body-wide burden to the intake.",
    matches: (values) => values.fatigue === "severe",
  },
  {
    label: "Symptoms lasting 2-6 weeks",
    points: 1,
    sectionId: "core",
    kind: "base",
    rationale: "Persistence over multiple weeks increases follow-up relevance.",
    matches: (values) => values.duration === "2-6-weeks",
  },
  {
    label: "Symptoms lasting more than 6 weeks",
    points: 2,
    sectionId: "core",
    kind: "base",
    rationale: "Longer duration is a major persistence signal in the model.",
    matches: (values) => values.duration === "more-than-6-weeks",
  },
  {
    label: "Possible weight loss",
    points: 1,
    sectionId: "additional",
    kind: "base",
    rationale: "Possible weight loss increases concern modestly.",
    matches: (values) => values.weightLoss === "possible",
  },
  {
    label: "Clear weight loss",
    points: 2,
    sectionId: "additional",
    kind: "base",
    rationale: "Clear weight loss is treated as a stronger escalation feature.",
    matches: (values) => values.weightLoss === "clear",
  },
  {
    label: "Major appetite change",
    points: 1,
    sectionId: "additional",
    kind: "base",
    rationale: "Appetite change adds supporting weight to the broader pattern.",
    matches: (values) => values.appetiteChange === "major",
  },
  {
    label: "Frequent stool urgency",
    points: 1,
    sectionId: "additional",
    kind: "base",
    rationale: "Urgency helps distinguish a wider bowel-pattern cluster.",
    matches: (values) => values.stoolUrgency === "frequent",
  },
  {
    label: "Night symptoms sometimes",
    points: 1,
    sectionId: "additional",
    kind: "base",
    rationale: "Night disruption adds some extra concern in the interpretation.",
    matches: (values) => values.nightSymptoms === "sometimes",
  },
  {
    label: "Night symptoms often",
    points: 2,
    sectionId: "additional",
    kind: "base",
    rationale: "Frequent night symptoms are one of the stronger secondary pattern signals.",
    matches: (values) => values.nightSymptoms === "often",
  },
  {
    label: "Frequent nausea or vomiting",
    points: 1,
    sectionId: "additional",
    kind: "base",
    rationale: "Frequent upper-GI-type symptoms add broader burden to the intake.",
    matches: (values) => values.nauseaVomiting === "frequent",
  },
  {
    label: "Moderate daily-life impact",
    points: 1,
    sectionId: "additional",
    kind: "base",
    rationale: "Meaningful day-to-day disruption strengthens the signal.",
    matches: (values) => values.impactDailyLife === "moderate",
  },
  {
    label: "High daily-life impact",
    points: 2,
    sectionId: "additional",
    kind: "base",
    rationale: "High disruption suggests the symptom pattern is materially affecting routine life.",
    matches: (values) => values.impactDailyLife === "high",
  },
  {
    label: "Family history of GI disease",
    points: 2,
    sectionId: "context",
    kind: "context",
    rationale: "Family history acts as a context multiplier for the symptom pattern.",
    matches: (values) => values.familyHistory === "yes",
  },
  {
    label: "Age group 50+",
    points: 1,
    sectionId: "context",
    kind: "context",
    rationale: "Older age groups receive a modest background adjustment.",
    matches: (values) => values.ageGroup === "50-plus",
  },
  {
    label: "Prior evaluation already sought",
    points: 1,
    sectionId: "context",
    kind: "context",
    rationale: "Prior evaluation can indicate symptom persistence or concern despite no diagnosis here.",
    matches: (values) => values.priorEvaluation !== "none",
  },
  {
    label: "Persistent bleeding plus long duration",
    points: 1,
    sectionId: "interaction",
    kind: "interaction",
    rationale: "Persistent bleeding becomes more concerning when it has also lasted more than 6 weeks.",
    matches: (values) =>
      values.rectalBleeding === "persistent" && values.duration === "more-than-6-weeks",
  },
  {
    label: "Bleeding plus bowel-pattern change",
    points: 1,
    sectionId: "interaction",
    kind: "interaction",
    rationale: "Bleeding and bowel-pattern change together make the profile harder to dismiss as isolated.",
    matches: (values) =>
      values.rectalBleeding !== "none" && values.bowelChange === "significant",
  },
  {
    label: "Bowel-pattern cluster",
    points: 1,
    sectionId: "interaction",
    kind: "interaction",
    rationale: "Significant bowel change paired with urgency or night symptoms strengthens the cluster.",
    matches: (values) =>
      values.bowelChange === "significant" &&
      (values.stoolUrgency === "frequent" || values.nightSymptoms !== "no"),
  },
  {
    label: "Systemic burden cluster",
    points: 1,
    sectionId: "interaction",
    kind: "interaction",
    rationale: "Clear weight loss becomes more meaningful when paired with fatigue or appetite change.",
    matches: (values) =>
      values.weightLoss === "clear" &&
      (values.fatigue === "severe" || values.appetiteChange === "major"),
  },
  {
    label: "Family history amplifies bleeding signal",
    points: 1,
    sectionId: "interaction",
    kind: "interaction",
    rationale: "Family history increases how much bleeding contributes to the model.",
    matches: (values) =>
      values.familyHistory === "yes" && values.rectalBleeding !== "none",
  },
  {
    label: "Short-duration dampener",
    points: -1,
    sectionId: "interaction",
    kind: "dampener",
    rationale: "Very short-duration cases without stronger red flags are intentionally dampened.",
    matches: (values) =>
      values.duration === "less-than-2-weeks" &&
      values.rectalBleeding !== "persistent" &&
      values.weightLoss !== "clear" &&
      values.nightSymptoms !== "often",
  },
  {
    label: "Low-burden dampener",
    points: -1,
    sectionId: "interaction",
    kind: "dampener",
    rationale: "Mild, low-impact cases are intentionally prevented from over-escalating.",
    matches: (values) =>
      values.impactDailyLife === "low" &&
      values.rectalBleeding === "none" &&
      values.familyHistory === "no" &&
      values.duration !== "more-than-6-weeks",
  },
];

const sectionLabels: Record<AssessmentSectionId, string> = {
  core: "Core symptoms",
  additional: "Additional symptom pattern",
  context: "Risk context",
};

function getRiskLevel(score: number): RiskLevel {
  if (score >= 11) {
    return "High";
  }

  if (score >= 5) {
    return "Moderate";
  }

  return "Low";
}

function buildValidationNotes(values: SymptomFormValues): ValidationNote[] {
  const notes: ValidationNote[] = [];

  if (values.weightLoss === "clear" && values.duration === "less-than-2-weeks") {
    notes.push({
      level: "warning",
      message:
        "Clear weight loss with very short duration may reflect a rapidly changing situation, so the rule-based interpretation should be treated cautiously.",
    });
  }

  if (values.abdominalPain === "severe" && values.impactDailyLife === "low") {
    notes.push({
      level: "info",
      message:
        "Severe pain paired with low daily-life impact is an uncommon combination and reduces confidence in the self-reported pattern.",
    });
  }

  if (values.stoolUrgency === "frequent" && values.bowelChange === "none") {
    notes.push({
      level: "info",
      message:
        "Frequent urgency without any reported bowel-pattern change makes the bowel-pattern interpretation less stable.",
    });
  }

  if (values.priorEvaluation !== "none" && values.rectalBleeding === "none" && values.weightLoss === "none") {
    notes.push({
      level: "info",
      message:
        "Prior evaluation adds context, but the current intake still looks lower-signal than some reviewed cases.",
    });
  }

  return notes;
}

function buildPatternLens(values: SymptomFormValues): string {
  if (
    values.rectalBleeding === "persistent" &&
    values.duration === "more-than-6-weeks" &&
    values.bowelChange === "significant"
  ) {
    return "Persistent colorectal warning-sign cluster";
  }

  if (
    values.bowelChange === "significant" &&
    (values.stoolUrgency === "frequent" || values.nightSymptoms !== "no")
  ) {
    return "Bowel-pattern cluster with persistence features";
  }

  if (values.rectalBleeding !== "none" && values.bowelChange === "none" && values.weightLoss === "none") {
    return "Lower-burden bleeding-led pattern";
  }

  return "Lower-signal mixed pattern";
}

function buildSectionSummary(id: AssessmentSectionId, score: number): string {
  if (id === "core") {
    if (score >= 6) {
      return "Core symptom severity and persistence are the main drivers of the current flag.";
    }

    if (score >= 3) {
      return "Core symptoms contribute some concern, but they are not overwhelming on their own.";
    }

    return "Core warning-sign symptoms remain relatively limited in this intake.";
  }

  if (id === "additional") {
    if (score >= 5) {
      return "Supporting symptom pattern features are materially strengthening the overall result.";
    }

    if (score >= 2) {
      return "Additional symptoms add context, but do not dominate the interpretation.";
    }

    return "Supporting symptom features add little extra weight here.";
  }

  if (score >= 2) {
    return "Background context meaningfully strengthens the interpretation.";
  }

  return "Risk context contributes only limited additional weight.";
}

function buildDriverSummary(
  scoreBreakdown: ScoreContribution[],
  interactionBreakdown: ScoreContribution[],
): string {
  const drivers = [...scoreBreakdown, ...interactionBreakdown]
    .filter((item) => item.points > 0)
    .sort((left, right) => right.points - left.points)
    .slice(0, 3)
    .map((item) => item.label);

  if (drivers.length === 0) {
    return "No strong weighted contributors were triggered in this run.";
  }

  if (drivers.length === 1) {
    return `The result is driven mostly by ${drivers[0].toLowerCase()}.`;
  }

  if (drivers.length === 2) {
    return `The result is driven mostly by ${drivers[0].toLowerCase()} and ${drivers[1].toLowerCase()}.`;
  }

  return `The strongest drivers were ${drivers[0].toLowerCase()}, ${drivers[1].toLowerCase()}, and ${drivers[2].toLowerCase()}.`;
}

function buildFollowUpSummary(risk: RiskLevel, values: SymptomFormValues): string {
  if (
    values.rectalBleeding === "persistent" &&
    values.duration === "more-than-6-weeks"
  ) {
    return "Because persistent bleeding has continued beyond 6 weeks, clinician review would be reasonable rather than continued watchful waiting.";
  }

  if (risk === "High") {
    return "The current combination of symptoms and persistence features supports prompt clinician review.";
  }

  if (risk === "Moderate") {
    return "This research-mode flag suggests follow-up should be considered if symptoms continue, worsen, or keep affecting daily life.";
  }

  return "The current output is lower-flag, but symptom persistence, worsening bleeding, or new red-flag features should lower the threshold for review.";
}

function buildExplanation(risk: RiskLevel, patternLens: string): string {
  if (risk === "High") {
    return `This intake triggered a high research-style flag because the pattern resembles a ${patternLens.toLowerCase()} with multiple weighted concern signals.`;
  }

  if (risk === "Moderate") {
    return `This intake produced a moderate research-style flag because the pattern shows a ${patternLens.toLowerCase()} with enough persistence and burden to merit follow-up attention.`;
  }

  return `This intake produced a low research-style flag because the pattern currently looks more like a ${patternLens.toLowerCase()} without stronger escalation signals.`;
}

function buildShareSummary(
  risk: RiskLevel,
  score: number,
  patternLens: string,
  driverSummary: string,
  followUpSummary: string,
): string {
  return [
    "GastroLens Research Summary",
    `Risk flag: ${risk}`,
    `Total score: ${score}`,
    `Pattern lens: ${patternLens}`,
    driverSummary,
    followUpSummary,
    "This is a research-mode assessment summary and not a medical diagnosis.",
    `Learn more: ${gastroCompassLinks.research}`,
  ].join("\n");
}

export function getMissingAssessmentLabels(values: SymptomFormState): string[] {
  return allAssessmentFields
    .filter((key) => values[key] === undefined)
    .map((key) => fieldLabels[key]);
}

export function assessRisk(values: SymptomFormValues): RiskAssessment {
  const triggeredRules = scoringRules.filter((rule) => rule.matches(values));
  const scoreBreakdown = triggeredRules.filter(
    (rule) => rule.kind === "base" || rule.kind === "context",
  );
  const interactionBreakdown = triggeredRules.filter((rule) => rule.kind === "interaction");
  const dampeners = triggeredRules.filter((rule) => rule.kind === "dampener");
  const rawScore = triggeredRules.reduce((total, rule) => total + rule.points, 0);
  const score = Math.max(0, rawScore);
  const risk = getRiskLevel(score);
  const patternLens = buildPatternLens(values);
  const sectionContributions: SectionContribution[] = (["core", "additional", "context"] as const).map(
    (sectionId) => {
      const sectionScore = scoreBreakdown
        .filter((rule) => rule.sectionId === sectionId)
        .reduce((total, rule) => total + rule.points, 0);

      return {
        id: sectionId,
        label: sectionLabels[sectionId],
        score: sectionScore,
        summary: buildSectionSummary(sectionId, sectionScore),
      };
    },
  );
  const validationNotes = buildValidationNotes(values);
  const driverSummary = buildDriverSummary(scoreBreakdown, interactionBreakdown);
  const followUpSummary = buildFollowUpSummary(risk, values);

  return {
    score,
    risk,
    patternLens,
    explanation: buildExplanation(risk, patternLens),
    driverSummary,
    followUpSummary,
    safetyNote:
      "This tool is non-diagnostic and meant only to surface symptom patterns that may deserve clinician review.",
    sectionContributions,
    scoreBreakdown,
    interactionBreakdown,
    dampeners,
    validationNotes,
    ruleLogicNote:
      "GastroLens uses deterministic weighted rules so every point in the result can be traced back to an explicit symptom, context signal, or interaction bonus. Broader project and research context live on gastrocompass.org.",
    shareSummary: buildShareSummary(risk, score, patternLens, driverSummary, followUpSummary),
  };
}

export function validateAssessmentInput(values: SymptomFormState) {
  const missingFields = getMissingAssessmentLabels(values);

  if (!isCompleteAssessment(values)) {
    return {
      ok: false as const,
      missingFields,
    };
  }

  return {
    ok: true as const,
    values,
  };
}
