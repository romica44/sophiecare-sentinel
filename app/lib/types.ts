export type PatientInput = {
  patientName: string;
  age: string;
  procedure: string;
  medicalHistory: string;
  medications: string;
  allergies: string;
  labNotes: string;
};

export type AgentName =
  | "Supervisor Agent"
  | "Intake Agent"
  | "Risk Agent"
  | "Planning Agent"
  | "Compliance Agent"
  | "Documentation Agent";

export type AgentLog = {
  time: string;
  from: AgentName;
  to: AgentName | "Clinical Team";
  message: string;
  status: "completed" | "analyzing" | "warning" | "coordinating";
};

export type AgentOutput = {
  agent: AgentName;
  summary: string;
  findings: string[];
  priority: "low" | "medium" | "high";
};

export type AnalysisResult = {
  provider: string;
  executiveSummary: string;
  riskScore: number;
  readiness: number;
  agents: AgentOutput[];
  communicationLog: AgentLog[];
  checklist: string[];
  missingItems: string[];
  documentation: string;
  safetyDisclaimer: string;
};
