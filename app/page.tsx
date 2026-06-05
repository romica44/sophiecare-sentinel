"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  BadgeCheck,
  Brain,
  ClipboardCheck,
  FileText,
  Network,
  ShieldCheck,
  Stethoscope,
  Users,
  X,
  Download,
  Loader2
} from "lucide-react";
import type { AnalysisResult, PatientInput } from "./lib/types";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

const starter: PatientInput = {
  patientName: "Sofia Martinez",
  age: "62",
  procedure: "Cataract surgery - right eye",
  medicalHistory: "Autoimmune history, controlled hypertension, previous uveitis episode.",
  medications: "Prednisone 5mg daily, methotrexate weekly, antihypertensive medication.",
  allergies: "No known drug allergies.",
  labNotes: "CBC reviewed. Mild anemia history. Glucose within expected range. Pending signed consent confirmation.",
};

const iconMap: Record<string, any> = {
  "Supervisor Agent": Network,
  "Intake Agent": Users,
  "Risk Agent": ShieldCheck,
  "Planning Agent": ClipboardCheck,
  "Compliance Agent": Stethoscope,
  "Documentation Agent": FileText,
};

// ─── ESTILOS PARA EL PDF ───
const pdfStyles = StyleSheet.create({
  page: { padding: 40, backgroundColor: "#ffffff", fontFamily: "Helvetica" },
  header: { display: "flex", flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 2, borderBottomColor: "#00e5ff", paddingBottom: 10, marginBottom: 20 },
  brand: { display: "flex", flexDirection: "column" },
  title: { fontSize: 20, fontWeight: "bold", color: "#050814" },
  subtitle: { fontSize: 10, color: "#6b8fae", marginTop: 2 },
  meta: { textAlign: "right", fontSize: 10, color: "#475467" },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", color: "#0066cc", borderBottomWidth: 1, borderBottomColor: "#eaecf0", paddingBottom: 3, marginBottom: 8, textTransform: "uppercase" },
  row: { display: "flex", flexDirection: "row", marginBottom: 5 },
  label: { fontSize: 10, fontWeight: "bold", color: "#344054", width: 100 },
  value: { fontSize: 10, color: "#475467", flex: 1 },
  metricsRow: { display: "flex", flexDirection: "row", gap: 10, marginBottom: 15 },
  metricBox: { flex: 1, backgroundColor: "#f9fafb", borderWidth: 1, borderColor: "#eaecf0", padding: 8, borderRadius: 4 },
  metricLabel: { fontSize: 8, color: "#475467", textTransform: "uppercase" },
  metricVal: { fontSize: 16, fontWeight: "bold", color: "#101828", marginTop: 2 },
  executiveBox: { backgroundColor: "#f4f9ff", borderLeftWidth: 3, borderLeftColor: "#00e5ff", padding: 10, borderRadius: 4, marginBottom: 15 },
  executiveText: { fontSize: 10, color: "#1d2939", lineHeight: 1.4 },
  agentBlock: { paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#eaecf0", borderStyle: "dashed" },
  agentHeader: { display: "flex", flexDirection: "row", justifyContent: "space-between" },
  agentName: { fontSize: 11, fontWeight: "bold", color: "#101828" },
  agentPriority: { fontSize: 9, color: "#475467" },
  agentSummary: { fontSize: 10, color: "#344054", marginTop: 2, marginBottom: 4 },
  findingItem: { fontSize: 9, color: "#475467", marginLeft: 10, marginBottom: 1 },
  footer: { position: "absolute", bottom: 20, left: 40, right: 40, textAlign: "center", fontSize: 8, color: "#98a2b3", borderTopWidth: 1, borderTopColor: "#eaecf0", paddingTop: 5 }
});

const MyPdfDocument = ({ result, form }: { result: AnalysisResult; form: PatientInput }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <View style={pdfStyles.brand}>
          <Text style={pdfStyles.title}>SophieCare Sentinel</Text>
          <Text style={pdfStyles.subtitle}>Multi-Agent Surgical AI Copilot Assessment</Text>
        </View>
        <View style={pdfStyles.meta}>
          <Text>Session ID: SC-8937-AI</Text>
          <Text>Date: {new Date().toLocaleDateString('en-US')}</Text>
        </View>
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Patient Clinical Intake Data</Text>
        <View style={pdfStyles.row}><Text style={pdfStyles.label}>Patient Name:</Text><Text style={pdfStyles.value}>{form.patientName}</Text></View>
        <View style={pdfStyles.row}><Text style={pdfStyles.label}>Age:</Text><Text style={pdfStyles.value}>{form.age}</Text></View>
        <View style={pdfStyles.row}><Text style={pdfStyles.label}>Procedure:</Text><Text style={pdfStyles.value}>{form.procedure}</Text></View>
        <View style={pdfStyles.row}><Text style={pdfStyles.label}>Medical History:</Text><Text style={pdfStyles.value}>{form.medicalHistory}</Text></View>
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Global Analytics Summary</Text>
        <View style={pdfStyles.metricsRow}>
          <View style={pdfStyles.metricBox}><Text style={pdfStyles.metricLabel}>Risk Score</Text><Text style={pdfStyles.metricVal}>{result.riskScore ?? 32}%</Text></View>
          <View style={pdfStyles.metricBox}><Text style={pdfStyles.metricLabel}>Surgical Readiness</Text><Text style={pdfStyles.metricVal}>{result.readiness ?? 95}%</Text></View>
          <View style={pdfStyles.metricBox}><Text style={pdfStyles.metricLabel}>Framework Core</Text><Text style={pdfStyles.metricVal}>{result.provider ?? "Gemini Core"}</Text></View>
        </View>
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Executive Context Summary</Text>
        <View style={pdfStyles.executiveBox}><Text style={pdfStyles.executiveText}>{result.executiveSummary}</Text></View>
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Autonomous Agent Determinations</Text>
        {result.agents?.map((agent, i) => (
          <View key={i} style={pdfStyles.agentBlock}>
            <View style={pdfStyles.agentHeader}>
              <Text style={pdfStyles.agentName}>{agent.agent}</Text>
              <Text style={pdfStyles.agentPriority}>Priority: {agent.priority}</Text>
            </View>
            <Text style={pdfStyles.agentSummary}>{agent.summary}</Text>
            {agent.findings?.map((f, idx) => <Text key={idx} style={pdfStyles.findingItem}>• {f}</Text>)}
          </View>
        ))}
      </View>

      <Text style={pdfStyles.footer}>
        LEGAL DISCLAIMER: SophieCare Sentinel is an AI-powered workflow automation and orchestration prototype designed solely for educational, demonstration, and research purposes. It does not provide professional medical diagnosis, clinical advice, or treatment plans. This automated risk synthesis must NOT replace professional clinical judgment.
      </Text>
    </Page>
  </Document>
);

export default function Home() {
  const [form, setForm] = useState<PatientInput>(starter);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // CONTROLADORES DE ANIMACIÓN PARA LA DEMO EN VIVO
  const [activeNode, setActiveNode] = useState<string>("idle");

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Simulación secuencial de iluminación de nodos de agentes para la visualización de compartición de contexto
  useEffect(() => {
    if (loading) {
      const sequence = ["intake", "supervisor-1", "risk", "supervisor-2", "planning", "compliance", "documentation"];
      let index = 0;
      
      const interval = setInterval(() => {
        if (index < sequence.length) {
          setActiveNode(sequence[index]);
          index++;
        } else {
          index = 0; // Bucle infinito de comunicación durante el loading
        }
      }, 1200);

      return () => clearInterval(interval);
    } else {
      setActiveNode("idle");
    }
  }, [loading]);

  const update = (key: keyof PatientInput, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function analyzeCase() {
    setLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      setResult(data);
      setIsModalOpen(true); 
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-logo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <div>
            <div className="navbar-title">SophieCare Sentinel</div>
            <div className="navbar-subtitle">Multi-Agent Surgical AI Copilot</div>
          </div>
        </div>

        <div className="navbar-status">System Online</div>

        <div className="navbar-meta">
          <div>Session ID: <span>SC-8937-AI</span></div>
          <div>Time: <span>10:42:31 AM</span></div>
        </div>

        {result && (
          <button className="navbar-export" onClick={() => setIsModalOpen(true)}>
            <FileText size={13} />
            View Last Report
          </button>
        )}
      </nav>

      <div className="workspace-layout">
        
        <aside className="panel-container">
          <div className="section-title">Patient Intake (Panel)</div>
          <div className="scroll-content">
            <div className="patient-header-badge">PATIENT INTAKE</div>
            
            <div className="form-group">
              <label>Patient name</label>
              <input className="form-input" value={form.patientName} onChange={(e) => update("patientName", e.target.value)} />
            </div>

            <div className="form-group">
              <label>Age</label>
              <input className="form-input" value={form.age} onChange={(e) => update("age", e.target.value)} />
            </div>

            <div className="form-group">
              <label>Procedure</label>
              <input className="form-input" value={form.procedure} onChange={(e) => update("procedure", e.target.value)} />
            </div>

            <div className="form-group">
              <label>Medical history</label>
              <textarea className="form-textarea" value={form.medicalHistory} onChange={(e) => update("medicalHistory", e.target.value)} />
            </div>

            <div className="form-group">
              <label>Medications</label>
              <textarea className="form-textarea" value={form.medications} onChange={(e) => update("medications", e.target.value)} />
            </div>

            <div className="form-group">
              <label>Allergies</label>
              <textarea className="form-textarea" value={form.allergies} onChange={(e) => update("allergies", e.target.value)} />
            </div>

            <div className="form-group">
              <label>Lab / imaging notes</label>
              <textarea className="form-textarea" value={form.labNotes} onChange={(e) => update("labNotes", e.target.value)} />
            </div>

            <button className="action-btn" onClick={analyzeCase} disabled={loading}>
              {loading ? "Coordinating agents..." : "Analyze with Agents"}
            </button>
          </div>
        </aside>

        <section className="network-display-area">
          <svg className="network-canvas" viewBox="0 0 600 500" preserveAspectRatio="none">
            <line x1="300" y1="250" x2="300" y2="60" className={activeNode === "intake" || activeNode === "supervisor-1" ? "line-pulse" : ""} />
            <line x1="300" y1="250" x2="490" y2="150" className={activeNode === "risk" || activeNode === "supervisor-2" ? "line-pulse" : ""} />
            <line x1="300" y1="250" x2="490" y2="350" className={activeNode === "planning" ? "line-pulse" : ""} />
            <line x1="300" y1="250" x2="300" y2="440" className={activeNode === "documentation" ? "line-pulse" : ""} />
            <line x1="300" y1="250" x2="110" y2="350" className={activeNode === "compliance" ? "line-pulse" : ""} />
            <line x1="300" y1="250" x2="110" y2="150" className={activeNode === "idle" ? "" : ""} />
          </svg>

          <div className={`central-supervisor-node ${activeNode.startsWith("supervisor") ? "node-shining-purple" : ""}`}>
            <Brain className="sv-icon" size={32} />
            <div className="sv-title">Supervisor Agent</div>
            <div className="sv-tag">
              {activeNode.startsWith("supervisor") ? "ROUTE CONTEXT" : "Coordinating"}
            </div>
          </div>

          <div className={`satellite-node node-pos-1 ${activeNode === "intake" ? "node-shining-cyan" : ""}`}>
            <div className="node-icon-wrapper"><Users size={16} /></div>
            <div className="node-text-block">
              <div className="node-meta-headline">01 Intake Agent</div>
              <div className="node-status-indicator"><span>{activeNode === "intake" ? "EXTRACTING DATA" : "Active"}</span></div>
              <p className="node-summary-p">Extracting data and records.</p>
            </div>
          </div>

          <div className={`satellite-node node-pos-2 ${activeNode === "risk" ? "node-shining-cyan" : ""}`}>
            <div className="node-icon-wrapper"><ShieldCheck size={16} /></div>
            <div className="node-text-block">
              <div className="node-meta-headline">02 Risk Agent</div>
              <div className="node-status-indicator"><span>{activeNode === "risk" ? "EVALUATING HISTORY" : "Active"}</span></div>
              <p className="node-summary-p">Analyzing potential risks.</p>
            </div>
          </div>

          <div className={`satellite-node node-pos-3 ${activeNode === "planning" ? "node-shining-cyan" : ""}`}>
            <div className="node-icon-wrapper"><ClipboardCheck size={16} /></div>
            <div className="node-text-block">
              <div className="node-meta-headline">03 Planning Agent</div>
              <div className="node-status-indicator"><span>{activeNode === "planning" ? "REVISING CHEKLIST" : "Active"}</span></div>
              <p className="node-summary-p">Creating schedule matrices.</p>
            </div>
          </div>

          <div className={`satellite-node node-pos-4 ${activeNode === "documentation" ? "node-shining-cyan" : ""}`}>
            <div className="node-icon-wrapper"><FileText size={16} /></div>
            <div className="node-text-block">
              <div className="node-meta-headline">05 Documentation</div>
              <div className="node-status-indicator"><span>{activeNode === "documentation" ? "COMPILING PDF" : "Active"}</span></div>
              <p className="node-summary-p">Compiling paperwork.</p>
            </div>
          </div>

          <div className={`satellite-node node-pos-5 ${activeNode === "compliance" ? "node-shining-cyan" : ""}`}>
            <div className="node-icon-wrapper"><BadgeCheck size={16} /></div>
            <div className="node-text-block">
              <div className="node-meta-headline">04 Compliance Agent</div>
              <div className="node-status-indicator"><span>{activeNode === "compliance" ? "VALIDATING" : "Active"}</span></div>
              <p className="node-summary-p">Validating regulatory items.</p>
            </div>
          </div>

          <div className="satellite-node node-pos-6">
            <div className="node-icon-wrapper"><Network size={16} /></div>
            <div className="node-text-block">
              <div className="node-meta-headline">06 Comms Agent</div>
              <div className="node-status-indicator"><span>Active</span></div>
              <p className="node-summary-p">Routing inter-agent sockets.</p>
            </div>
          </div>
        </section>

        <aside className="panel-container">
          <div className="comms-header-group">
            <div className="section-title" style={{ margin: 0 }}>Agent-to-Agent Communication</div>
            <Activity className="comms-pulse-wave" size={14} />
          </div>
          <div className="scroll-content">
            {result?.communicationLog ? (
              result.communicationLog.map((log, idx) => (
                <div key={idx} className="feed-log-item">
                  <div className="log-timestamp">{log.time}</div>
                  <div className="log-routing-tag">{log.from.toUpperCase()} → {log.to.toUpperCase()}</div>
                  <p className="log-message-text">"{log.message}"</p>
                </div>
              ))
            ) : (
              <>
                <div className="feed-log-item link-intake">
                  <div className="log-timestamp">10:42:15</div>
                  <div className="log-routing-tag">Intake Agent → Risk Agent</div>
                  <p className="log-message-text">"Autoimmune history detected: Patient profile contains active uveitis and controlled hypertension markers."</p>
                </div>
                
                <div className="feed-log-item link-risk">
                  <div className="log-timestamp">10:42:18</div>
                  <div className="log-routing-tag">Risk Agent → Planning Agent</div>
                  <p className="log-message-text">"Recommend additional inflammation monitoring. High risk of post-operative uveitis flare-up due to steroid usage."</p>
                </div>

                <div className="feed-log-item link-planning">
                  <div className="log-timestamp">10:42:21</div>
                  <div className="log-routing-tag">Planning Agent → Documentation Agent</div>
                  <p className="log-message-text">"Generate revised checklist: Mandatory pre-surgical clearing and special anesthetic protocol required."</p>
                </div>

                <div className="feed-log-item link-compliance">
                  <div className="log-timestamp">10:42:24</div>
                  <div className="log-routing-tag">Compliance Agent → Supervisor Agent</div>
                  <p className="log-message-text">"All patient processing tokens validated against internal surgical safety requirements. Clearance approved."</p>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      <footer className="bottom-metrics-dashboard">
        <div className="compact-metric-card">
          <div className="metric-card-label">Risk Score</div>
          <div className="metric-card-value" style={{ color: 'var(--yellow)' }}>{result?.riskScore ?? 32}%</div>
          <div className="progressBar-container">
            <div className="progressBar-fill" style={{ width: `${result?.riskScore ?? 32}%`, background: "var(--yellow)" }}></div>
          </div>
        </div>

        <div className="compact-metric-card">
          <div className="metric-card-label">Readiness</div>
          <div className="metric-card-value" style={{ color: 'var(--cyan)' }}>{result?.readiness ?? 95}%</div>
          <div className="progressBar-container">
            <div className="progressBar-fill" style={{ width: `${result?.readiness ?? 95}%` }}></div>
          </div>
        </div>

        <div className="compact-metric-card">
          <div className="metric-card-label">AI Provider</div>
          <div className="metric-card-value">{result?.provider ?? "Gemini Core"}</div>
          <div className="metric-card-subtext">Multi-Agent Protocol</div>
        </div>

        <div className="compact-metric-card results-preview-block" onClick={() => result && setIsModalOpen(true)} style={{ cursor: result ? 'pointer' : 'default' }}>
          <div>
            <div className="metric-card-label" style={{ color: 'var(--purple)' }}>Executive Context (Click to Expand Report)</div>
            <p className="doc-preview-p" style={{ marginTop: '2px' }}>
              {result?.executiveSummary ?? "All autonomous agent pipelines standing by. Execution will log raw telemetry data."}
            </p>
          </div>
        </div>
      </footer>

      {isModalOpen && result && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Agent Analysis Summary</h2>
                <p>System coordination completed successfully</p>
              </div>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body scroll-content">
              <div className="modal-executive-box">
                <h3>Executive Summary</h3>
                <p>{result.executiveSummary}</p>
              </div>

              <h3>Detailed Agent Determinations</h3>
              <div className="modal-grid-agents">
                {result.agents?.map((agent, i) => {
                  const Icon = iconMap[agent.agent] || Brain;
                  return (
                    <div className="modal-agent-card" key={i}>
                      <div className="modal-agent-card-title">
                        <Icon size={16} style={{ color: 'var(--cyan)' }} />
                        <strong>{agent.agent}</strong>
                        <span className={`pill ${agent.priority.toLowerCase()}`}>{agent.priority}</span>
                      </div>
                      <p>{agent.summary}</p>
                      <ul>
                        {agent.findings?.map((f, idx) => (
                          <li key={idx}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              <div className="modal-disclaimer-box" style={{
                marginTop: '20px',
                padding: '12px',
                background: 'rgba(255, 194, 60, 0.03)',
                border: '1px solid rgba(255, 194, 60, 0.2)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                color: 'var(--yellow)',
                lineHeight: '1.4'
              }}>
                <strong>⚠️ SAFETY & LEGAL NOTICE:</strong> This system is an AI orchestration prototype for clinical workflow demonstration and hackathon evaluation purposes only. It does not constitute medical advice or substitute diagnostic criteria. All generated synthetic data and agent evaluations must be verified by a licensed healthcare professional.
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn-secondary" onClick={() => setIsModalOpen(false)}>
                Dismiss
              </button>

              {isClient && (
                <PDFDownloadLink
                  document={<MyPdfDocument result={result} form={form} />}
                  fileName={`SophieCare_Report_${form.patientName.replace(/\s+/g, '_')}.pdf`}
                  className="modal-btn-primary-link"
                >
                  {({ loading: pdfLoading }) => (
                    <span className="download-btn-inner">
                      {pdfLoading ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <Download size={14} />
                          Download Assessment PDF
                        </>
                      )}
                    </span>
                  )}
                </PDFDownloadLink>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}