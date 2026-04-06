import { NextRequest, NextResponse } from "next/server";
import { assessRisk, validateAssessmentInput } from "@/lib/scoring";
import { SymptomFormState } from "@/lib/types";

export async function POST(request: NextRequest) {
  const values = (await request.json()) as SymptomFormState;
  const validation = validateAssessmentInput(values);

  if (!validation.ok) {
    return NextResponse.json(
      {
        message: "Please complete the full assessment before generating a result.",
        missingFields: validation.missingFields,
      },
      { status: 400 },
    );
  }

  const assessment = assessRisk(validation.values);

  return NextResponse.json(assessment);
}
