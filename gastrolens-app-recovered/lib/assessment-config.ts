import {
  AssessmentFieldConfig,
  AssessmentStepConfig,
  DemoScenario,
  SymptomFormState,
  SymptomFormValues,
} from "@/lib/types";

export const gastroCompassLinks = {
  home: "https://gastrocompass.org",
  research: "https://gastrocompass.org/research",
  overview: "https://gastrocompass.org/about",
} as const;

export const fieldLabels: Record<keyof SymptomFormValues, string> = {
  rectalBleeding: "Rectal bleeding",
  bowelChange: "Change in bowel habits",
  abdominalPain: "Abdominal pain",
  fatigue: "Fatigue",
  duration: "Duration of symptoms",
  weightLoss: "Weight loss",
  appetiteChange: "Appetite change",
  stoolUrgency: "Stool urgency",
  nightSymptoms: "Night symptoms",
  nauseaVomiting: "Nausea or vomiting",
  impactDailyLife: "Impact on daily life",
  familyHistory: "Family history of GI disease",
  ageGroup: "Age group",
  priorEvaluation: "Prior evaluation for this issue",
};

const coreFields: AssessmentFieldConfig[] = [
  {
    key: "rectalBleeding",
    label: "Rectal bleeding",
    options: [
      { label: "None", value: "none" },
      { label: "Occasional", value: "occasional" },
      { label: "Persistent", value: "persistent", hint: "A repeated or ongoing pattern." },
    ],
  },
  {
    key: "bowelChange",
    label: "Change in bowel habits",
    options: [
      { label: "None", value: "none" },
      { label: "Mild", value: "mild" },
      { label: "Significant", value: "significant", hint: "A noticeable sustained change." },
    ],
  },
  {
    key: "abdominalPain",
    label: "Abdominal pain",
    options: [
      { label: "None", value: "none" },
      { label: "Mild", value: "mild" },
      { label: "Severe", value: "severe" },
    ],
  },
  {
    key: "fatigue",
    label: "Fatigue",
    options: [
      { label: "None", value: "none" },
      { label: "Mild", value: "mild" },
      { label: "Severe", value: "severe" },
    ],
  },
  {
    key: "duration",
    label: "Duration of symptoms",
    options: [
      { label: "Less than 2 weeks", value: "less-than-2-weeks" },
      { label: "2-6 weeks", value: "2-6-weeks" },
      { label: "More than 6 weeks", value: "more-than-6-weeks" },
    ],
  },
];

const additionalFields: AssessmentFieldConfig[] = [
  {
    key: "weightLoss",
    label: "Weight loss",
    options: [
      { label: "None", value: "none" },
      { label: "Possible", value: "possible" },
      { label: "Clear", value: "clear" },
    ],
  },
  {
    key: "appetiteChange",
    label: "Appetite change",
    options: [
      { label: "None", value: "none" },
      { label: "Mild", value: "mild" },
      { label: "Major", value: "major" },
    ],
  },
  {
    key: "stoolUrgency",
    label: "Stool urgency",
    options: [
      { label: "None", value: "none" },
      { label: "Sometimes", value: "sometimes" },
      { label: "Frequent", value: "frequent" },
    ],
  },
  {
    key: "nightSymptoms",
    label: "Night symptoms",
    options: [
      { label: "No", value: "no" },
      { label: "Sometimes", value: "sometimes" },
      { label: "Often", value: "often", hint: "Symptoms waking you or disrupting sleep." },
    ],
  },
  {
    key: "nauseaVomiting",
    label: "Nausea or vomiting",
    options: [
      { label: "None", value: "none" },
      { label: "Mild", value: "mild" },
      { label: "Frequent", value: "frequent" },
    ],
  },
  {
    key: "impactDailyLife",
    label: "Impact on daily life",
    options: [
      { label: "Low", value: "low" },
      { label: "Moderate", value: "moderate" },
      { label: "High", value: "high" },
    ],
  },
];

const contextFields: AssessmentFieldConfig[] = [
  {
    key: "familyHistory",
    label: "Family history of GI disease",
    options: [
      { label: "No", value: "no" },
      { label: "Yes", value: "yes" },
    ],
  },
  {
    key: "ageGroup",
    label: "Age group",
    options: [
      { label: "Under 30", value: "under-30" },
      { label: "30-49", value: "30-49" },
      { label: "50+", value: "50-plus" },
    ],
  },
  {
    key: "priorEvaluation",
    label: "Prior evaluation for this issue",
    options: [
      { label: "None", value: "none" },
      { label: "Primary care", value: "primary-care" },
      { label: "GI specialist", value: "gi-specialist" },
    ],
  },
];

export const assessmentSteps: AssessmentStepConfig[] = [
  {
    id: "coreSymptoms",
    sectionId: "core",
    stepNumber: 1,
    title: "Core symptoms",
    description: "Capture the primary symptoms and how long they have persisted.",
    helperText: "These are the strongest first-line signals in the deterministic score.",
    fields: coreFields,
  },
  {
    id: "additionalPattern",
    sectionId: "additional",
    stepNumber: 2,
    title: "Additional symptom pattern",
    description: "Add the supporting features that make the symptom story more or less concerning.",
    helperText: "This step helps the tool distinguish mild short-lived patterns from broader symptom clusters.",
    fields: additionalFields,
  },
  {
    id: "riskContext",
    sectionId: "context",
    stepNumber: 3,
    title: "Risk context",
    description: "Capture background context that can strengthen or soften the interpretation.",
    helperText: "Context is used as an adjustment layer, not a diagnosis.",
    fields: contextFields,
  },
  {
    id: "researchSummary",
    stepNumber: 4,
    title: "Review and generate",
    description: "Confirm the intake and create the GastroLens research-style summary.",
    helperText: "The output is explainable, deterministic, and non-diagnostic.",
    fields: [],
  },
];

export const allAssessmentFields = [...coreFields, ...additionalFields, ...contextFields].map(
  (field) => field.key,
);

export const demoScenarios: DemoScenario[] = [
  {
    id: "minimal",
    label: "Minimal demo",
    description: "A short-duration low-concern example for quick presentations.",
    values: {
      rectalBleeding: "none",
      bowelChange: "mild",
      abdominalPain: "mild",
      fatigue: "none",
      duration: "less-than-2-weeks",
      weightLoss: "none",
      appetiteChange: "none",
      stoolUrgency: "none",
      nightSymptoms: "no",
      nauseaVomiting: "none",
      impactDailyLife: "low",
      familyHistory: "no",
      ageGroup: "30-49",
      priorEvaluation: "none",
    },
  },
  {
    id: "persistent-bleeding",
    label: "Persistent bleeding demo",
    description: "A moderate demo case centered on bleeding, persistence, and context.",
    values: {
      rectalBleeding: "persistent",
      bowelChange: "mild",
      abdominalPain: "mild",
      fatigue: "mild",
      duration: "more-than-6-weeks",
      weightLoss: "possible",
      appetiteChange: "mild",
      stoolUrgency: "sometimes",
      nightSymptoms: "sometimes",
      nauseaVomiting: "none",
      impactDailyLife: "moderate",
      familyHistory: "yes",
      ageGroup: "30-49",
      priorEvaluation: "primary-care",
    },
  },
  {
    id: "high-concern-cluster",
    label: "High-cluster demo",
    description: "A multi-signal demo case designed for judge-mode presentations.",
    values: {
      rectalBleeding: "persistent",
      bowelChange: "significant",
      abdominalPain: "severe",
      fatigue: "severe",
      duration: "more-than-6-weeks",
      weightLoss: "clear",
      appetiteChange: "major",
      stoolUrgency: "frequent",
      nightSymptoms: "often",
      nauseaVomiting: "frequent",
      impactDailyLife: "high",
      familyHistory: "yes",
      ageGroup: "under-30",
      priorEvaluation: "primary-care",
    },
  },
];

export function getMissingFields(
  values: SymptomFormState,
  keys: readonly (keyof SymptomFormValues)[],
): string[] {
  return keys
    .filter((key) => values[key] === undefined)
    .map((key) => fieldLabels[key]);
}

export function isCompleteAssessment(values: SymptomFormState): values is SymptomFormValues {
  return getMissingFields(values, allAssessmentFields).length === 0;
}
