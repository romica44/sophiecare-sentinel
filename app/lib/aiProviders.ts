import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult, PatientInput } from "./types";
import { buildMockAnalysis } from "./mockAgents";

function safeJson(text: string): AnalysisResult | null {
  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned) as AnalysisResult;
  } catch {
    return null;
  }
}

function systemPrompt(input: PatientInput) {
  return `You are SophieCare Sentinel, a multi-agent surgical workflow demo for a hackathon. Return ONLY valid JSON matching this exact schema:
{
  "provider": "string",
  "executiveSummary": "string",
  "riskScore": number,
  "readiness": number,
  "agents": [{"agent":"Supervisor Agent|Intake Agent|Risk Agent|Planning Agent|Compliance Agent|Documentation Agent","summary":"string","findings":["string"],"priority":"low|medium|high"}],
  "communicationLog": [{"time":"HH:mm","from":"Supervisor Agent|Intake Agent|Risk Agent|Planning Agent|Compliance Agent|Documentation Agent","to":"Supervisor Agent|Intake Agent|Risk Agent|Planning Agent|Compliance Agent|Documentation Agent|Clinical Team","message":"string","status":"completed|analyzing|warning|coordinating"}],
  "checklist": ["string"],
  "missingItems": ["string"],
  "documentation": "string",
  "safetyDisclaimer": "string"
}
Make the agents visibly communicate and coordinate. Do not provide medical diagnosis. Treat it as a workflow support demo.
Patient input: ${JSON.stringify(input)}`;
}

export async function runAnalysis(input: PatientInput): Promise<AnalysisResult> {
  const provider = (process.env.AI_PROVIDER || "mock").toLowerCase();

  if (provider === "gemini" && process.env.GEMINI_API_KEY) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-flash" });
    const result = await model.generateContent(systemPrompt(input));
    const parsed = safeJson(result.response.text());
    if (parsed) return { ...parsed, provider: `gemini:${process.env.GEMINI_MODEL || "gemini-1.5-flash"}` };
  }

  if (provider === "openrouter" && process.env.OPENROUTER_API_KEY) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://sophiecare-sentinel.vercel.app",
        "X-Title": "SophieCare Sentinel"
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "meta-llama/llama-3.1-8b-instruct:free",
        messages: [{ role: "user", content: systemPrompt(input) }],
        temperature: 0.2
      })
    });
    const data = await response.json();
    const parsed = safeJson(data?.choices?.[0]?.message?.content || "");
    if (parsed) return { ...parsed, provider: `openrouter:${process.env.OPENROUTER_MODEL}` };
  }

  if (provider === "ollama") {
    const response = await fetch(`${process.env.OLLAMA_BASE_URL || "http://localhost:11434"}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: process.env.OLLAMA_MODEL || "llama3.1:8b", prompt: systemPrompt(input), stream: false })
    });
    const data = await response.json();
    const parsed = safeJson(data?.response || "");
    if (parsed) return { ...parsed, provider: `ollama:${process.env.OLLAMA_MODEL}` };
  }

  return buildMockAnalysis(input);
}
