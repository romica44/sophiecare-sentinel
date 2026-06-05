import { AnalysisResult, PatientInput } from "./types";

const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export function buildMockAnalysis(input: PatientInput): AnalysisResult {
  const hasAllergy = input.allergies.trim().length > 0 && !/none|no/i.test(input.allergies);
  const hasMeds = input.medications.trim().length > 0;
  const hasLabs = input.labNotes.trim().length > 0;
  const age = Number(input.age || 0);
  const riskScore = Math.min(92, Math.max(22, 25 + (age > 60 ? 18 : 0) + (hasAllergy ? 14 : 0) + (hasMeds ? 10 : 0) + (!hasLabs ? 12 : 0)));
  const readiness = Math.max(50, 100 - Math.round(riskScore / 2) - (!hasLabs ? 10 : 0));

  return {
    provider: "mock-free-local",
    executiveSummary: `${input.patientName || "The patient"} is being prepared for ${input.procedure || "a scheduled procedure"}. The agent team found ${riskScore > 65 ? "several risk and readiness items requiring review" : "a manageable risk profile with standard pre-operative controls"}.`,
    riskScore,
    readiness,
    agents: [
      {
        agent: "Intake Agent",
        summary: "Patient information was normalized and converted into shared clinical context.",
        findings: [
          `Procedure: ${input.procedure || "Not specified"}`,
          `Medical history captured: ${input.medicalHistory ? "yes" : "missing"}`,
          `Medication list captured: ${hasMeds ? "yes" : "missing"}`,
          `Allergies captured: ${input.allergies ? "yes" : "missing"}`
        ],
        priority: input.medicalHistory ? "low" : "medium"
      },
      {
        agent: "Risk Agent",
        summary: "Potential perioperative risk signals were identified and prioritized.",
        findings: [
          hasAllergy ? "Allergy information requires surgical team verification." : "No explicit allergy risk was declared.",
          hasMeds ? "Medication reconciliation should be confirmed before the procedure." : "Medication list is missing or empty.",
          age > 60 ? "Age-related anesthetic risk should be reviewed." : "No age-related escalation detected.",
          !hasLabs ? "Lab notes are missing; readiness score reduced." : "Lab notes are available for review."
        ],
        priority: riskScore > 70 ? "high" : riskScore > 45 ? "medium" : "low"
      },
      {
        agent: "Planning Agent",
        summary: "Generated a practical operating room preparation plan.",
        findings: [
          "Confirm surgical site, laterality, patient identity, and procedure consent.",
          "Prepare instrument set and contingency supplies.",
          "Align anesthesia, nursing, and surgical roles before incision."
        ],
        priority: "medium"
      },
      {
        agent: "Compliance Agent",
        summary: "Checked required protocol and documentation readiness.",
        findings: [
          "Consent form must be validated before the procedure.",
          "Pre-op checklist should be signed by responsible staff.",
          hasLabs ? "Lab review present." : "Recent labs/imaging should be attached before final clearance."
        ],
        priority: !hasLabs ? "high" : "medium"
      },
      {
        agent: "Documentation Agent",
        summary: "Prepared structured documentation for the clinical team.",
        findings: [
          "Pre-op summary drafted.",
          "Risk note drafted.",
          "Post-op report template prepared."
        ],
        priority: "low"
      }
    ],
    communicationLog: [
      { time: now(), from: "Supervisor Agent", to: "Intake Agent", message: "Extract patient context and normalize the case data.", status: "coordinating" },
      { time: now(), from: "Intake Agent", to: "Risk Agent", message: "Shared medical history, medications, allergies, and lab notes.", status: "completed" },
      { time: now(), from: "Risk Agent", to: "Supervisor Agent", message: riskScore > 65 ? "Elevated risk signals detected. Escalation recommended." : "Risk profile is acceptable with standard controls.", status: riskScore > 65 ? "warning" : "completed" },
      { time: now(), from: "Supervisor Agent", to: "Planning Agent", message: "Adjust the surgical plan using the risk findings.", status: "coordinating" },
      { time: now(), from: "Compliance Agent", to: "Documentation Agent", message: "Include missing readiness items in the final summary.", status: !hasLabs ? "warning" : "completed" },
      { time: now(), from: "Documentation Agent", to: "Clinical Team", message: "Generated pre-op summary, checklist, and report template.", status: "completed" }
    ],
    checklist: [
      "Confirm patient identity and procedure",
      "Validate informed consent",
      "Review allergies and medications",
      "Confirm anesthesia readiness",
      "Verify instrument and supply availability",
      "Document pre-op risk assessment",
      "Run final surgical time-out"
    ],
    missingItems: [
      ...(!hasLabs ? ["Recent lab/imaging notes"] : []),
      ...(!input.medicalHistory ? ["Detailed medical history"] : []),
      "Signed informed consent confirmation"
    ],
    documentation: `Pre-operative agent summary for ${input.patientName || "patient"}: planned procedure is ${input.procedure || "not specified"}. Key context: ${input.medicalHistory || "no medical history provided"}. Medication context: ${input.medications || "not provided"}. Allergy context: ${input.allergies || "not provided"}. The system recommends final human validation before any clinical decision.`,
    safetyDisclaimer: "This demo is for hackathon/product workflow purposes only. It is not a medical device and must not be used for diagnosis, treatment, or real clinical decisions."
  };
}
