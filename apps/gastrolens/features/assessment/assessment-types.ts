export type RectalBleeding = "none" | "occasional" | "persistent";
export type BowelChange = "none" | "mild" | "significant";
export type AbdominalPain = "none" | "mild" | "severe";
export type Fatigue = "none" | "mild" | "severe";
export type Duration = "less-than-2-weeks" | "2-6-weeks" | "more-than-6-weeks";
export type FamilyHistory = "yes" | "no";
export type WeightLoss = "none" | "possible" | "clear";
export type AppetiteChange = "none" | "mild" | "major";
export type StoolUrgency = "none" | "sometimes" | "frequent";
export type NightSymptoms = "no" | "sometimes" | "often";
export type NauseaVomiting = "none" | "mild" | "frequent";
export type ImpactDailyLife = "low" | "moderate" | "high";
export type AgeGroup = "under-30" | "30-49" | "50-plus";
export type PriorEvaluation = "none" | "primary-care" | "gi-specialist";

export type SymptomFormValues = {
  rectalBleeding: RectalBleeding;
  bowelChange: BowelChange;
  abdominalPain: AbdominalPain;
  fatigue: Fatigue;
  duration: Duration;
  weightLoss: WeightLoss;
  appetiteChange: AppetiteChange;
  stoolUrgency: StoolUrgency;
  nightSymptoms: NightSymptoms;
  nauseaVomiting: NauseaVomiting;
  impactDailyLife: ImpactDailyLife;
  familyHistory: FamilyHistory;
  ageGroup: AgeGroup;
  priorEvaluation: PriorEvaluation;
};

export type SymptomFormState = Partial<SymptomFormValues>;

export type AssessmentSectionId = "core" | "additional" | "context";
export type AssessmentStepId =
  | "coreSymptoms"
  | "additionalPattern"
  | "riskContext"
  | "researchSummary";

export type RiskLevel = "Low" | "Moderate" | "High";
export type ValidationLevel = "info" | "warning";
export type RuleKind = "base" | "context" | "interaction" | "dampener";

export type FieldOption = {
  label: string;
  value: string;
  hint?: string;
};

export type AssessmentFieldConfig = {
  key: keyof SymptomFormValues;
  label: string;
  options: FieldOption[];
};

export type AssessmentStepConfig = {
  id: AssessmentStepId;
  sectionId?: AssessmentSectionId;
  stepNumber: number;
  title: string;
  description: string;
  helperText: string;
  fields: AssessmentFieldConfig[];
};

export type DemoScenario = {
  id: string;
  label: string;
  description: string;
  values: SymptomFormValues;
};

export type ScoreContribution = {
  label: string;
  points: number;
  kind: RuleKind;
  rationale: string;
  sectionId: AssessmentSectionId | "interaction";
};

export type SectionContribution = {
  id: AssessmentSectionId;
  label: string;
  score: number;
  summary: string;
};

export type ValidationNote = {
  level: ValidationLevel;
  message: string;
};

export type RiskAssessment = {
  score: number;
  risk: RiskLevel;
  explanation: string;
  patternLens: string;
  driverSummary: string;
  followUpSummary: string;
  safetyNote: string;
  sectionContributions: SectionContribution[];
  scoreBreakdown: ScoreContribution[];
  interactionBreakdown: ScoreContribution[];
  dampeners: ScoreContribution[];
  validationNotes: ValidationNote[];
  ruleLogicNote: string;
  shareSummary: string;
};
