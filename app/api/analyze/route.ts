import { NextResponse } from "next/server";
import { runAnalysis } from "@/app/lib/aiProviders";
import { PatientInput } from "@/app/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as PatientInput;
    const result = await runAnalysis(input);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
