import { Link } from 'react-router-dom'
import { SystemDetailSection } from '../../components/systems/SystemDetailSection'
import { SystemImageBlock } from '../../components/systems/SystemImageBlock'
import { SystemWorkflow } from '../../components/systems/SystemWorkflow'
import { SystemImpactGrid } from '../../components/systems/SystemImpactGrid'
import { DownloadPresentationButton } from '../../components/DownloadPresentationButton'
import { useDocumentHead } from '../../hooks/useDocumentHead'

/**
 * VajraCortex — AI Reasoning Engine Product Page
 * Route: /products/vajra-cortex
 * 
 * Industrial AI reasoning engine with 14-stage cognitive pipeline
 * for root cause analysis, investigations, and decision support.
 */
export function VajraCortex() {
  useDocumentHead(
    'Vajra Cortex — Industrial AI Reasoning Engine | Tvastr',
    'Advanced industrial AI reasoning engine with 14-stage cognitive pipeline for root cause analysis, AI investigations, and intelligent decision support at the point of production.',
    'https://tvastr.co/products/vajra-cortex'
  )

  return (
    <div id="presentation-root" style={{ background: '#ffffff', color: '#111827' }}>

      {/* ── Top nav ─────────────── */}
      <div
        className="sticky top-0 z-40 flex items-center justify-between px-6 md:px-12 h-14"
        style={{ background: 'rgba(255,255,255,0.95)', borderBottom: '1px solid #e5e7eb', backdropFilter: 'blur(8px)' }}
      >
        <Link to="/" className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 hover:text-slate-700 transition-colors">
          ← Tvastr
        </Link>
        <span className="text-xs text-slate-400 tracking-wide hidden sm:block">Vajra Cortex</span>
      </div>

      {/* ── SLIDE 1 — Title ───────────────────────────────────────── */}
      <section className="presentation-slide" style={{ background: '#ffffff' }}>
        <div className="max-w-[900px] mx-auto px-6 md:px-8 py-16 md:py-20 w-full">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-400 mb-6">
            Tvastr · Industrial AI Platform
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
            Vajra Cortex
          </h1>
          <p className="text-xl text-slate-500 font-light max-w-[680px] leading-relaxed">
            Industrial AI reasoning engine with 14-stage cognitive pipeline that delivers root cause analysis, AI-powered investigations, and intelligent decision support at the point of production.
          </p>
        </div>
        <div className="slide-footer">
          <span>Tvastr</span>
          <span>Vajra Cortex</span>
          <span className="slide-number" />
        </div>
      </section>

      {/* ── SLIDE 2 — The Problem ─────────────────────────────────── */}
      <SystemDetailSection
        label="01 / The Problem"
        title="Manufacturing decisions depend on human expertise, creating inconsistency and bottlenecks."
        body="Quality decisions in manufacturing rely heavily on operator experience and judgment. This creates variation across shifts, delays in problem-solving, and difficulty scaling expertise across multiple facilities."
        bullets={[
          'Inconsistent quality decisions across operators and shifts',
          'Time-consuming root cause analysis requiring expert knowledge',
          'Difficulty identifying patterns across thousands of parts',
          'Limited ability to investigate complex manufacturing issues',
          'Inability to scale domain expertise across the organization',
        ]}
      />

      {/* ── SLIDE 3 — The Solution ───────────────────────────────── */}
      <SystemDetailSection
        label="02 / The Solution"
        title="Conversational AI reasoning engine for manufacturing intelligence."
        body="Vajra Cortex is a retrieval-first executive cognition runtime that uses natural language to investigate manufacturing issues. Through a unified reasoning pipeline, it retrieves evidence from your data sources, validates quality, and generates evidence-backed answers with complete transparency."
      >
        <SystemWorkflow
          steps={[
            'Query Understanding',
            'Intent Classification',
            'Retrieval Planning',
            'Evidence Gathering',
            'Quality Validation',
            'Hypothesis Generation',
            'Causal Reasoning',
            'Answer Synthesis',
            'Provenance Tracking',
          ]}
          outputs={['Evidence-Backed Answers', 'Root Cause Analysis', 'Recommendations', 'Provenance']}
        />
      </SystemDetailSection>

      {/* ── SLIDE 4 — Reasoning Pipeline Architecture ───────────────────────────── */}
      <SystemDetailSection
        label="03 / AI Architecture"
        title="Unified reasoning pipeline from query to evidence-backed answer."
        body="Vajra Cortex processes natural language queries through a retrieval-first reasoning pipeline—emphasizing evidence quality over generative inference. Most intelligence happens before language generation, ensuring grounded, verifiable answers."
      >
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[780px]">
          {[
            { stage: 'Input Processing', steps: ['Query Preprocessing', 'Intent Understanding', 'Entity Extraction', 'Retrieval Planning'] },
            { stage: 'Evidence Gathering', steps: ['Multi-Source Retrieval', 'SQL Query Execution', 'Evidence Validation', 'Quality Scoring'] },
            { stage: 'Reasoning', steps: ['Observation Extraction', 'Hypothesis Generation', 'Evidence Evaluation', 'Causal Analysis'] },
            { stage: 'Synthesis', steps: ['RCA Execution', 'Recommendation Generation', 'Answer Synthesis', 'Provenance Tracking'] },
          ].map(({ stage, steps }) => (
            <div key={stage} className="p-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <p className="text-sm font-bold text-gray-800 mb-3">{stage}</p>
              <div className="space-y-2">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                    {step}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SystemDetailSection>

      {/* ── SLIDE 5 — AI Investigations ──────────────────────── */}
      <SystemDetailSection
        label="04 / AI Investigations"
        title="Voice-enabled manufacturing intelligence for real-time investigations."
        body="Vajra Cortex enables operators and engineers to investigate manufacturing issues using natural language queries. Ask questions about defect patterns, quality trends, or specific production conditions—and receive instant, data-backed answers."
        bullets={[
          'Natural language interface for manufacturing queries',
          'Voice-enabled for hands-free operation on the shop floor',
          'Real-time analysis of production data and quality patterns',
          'Root cause identification with evidence and recommendations',
          'Historical pattern recognition across production cycles',
          'Explainable AI with transparent reasoning paths',
        ]}
      />

      {/* ── SLIDE 6 — Conversational Intelligence ──────────────────────── */}
      <SystemDetailSection
        label="05 / Application — Conversational Intelligence"
        title="Natural language interface for manufacturing investigations."
        body="Vajra provides a conversational AI interface where operators and engineers can ask questions in natural language and receive evidence-backed answers in real-time through a chat-based experience."
        bullets={[
          'Chat-based interface with streaming responses',
          'Message-bound evidence for complete traceability',
          'Real-time thinking states showing reasoning progress',
          'Voice input support for hands-free operation',
          'Multilingual support (English + 8 Indian languages)',
          'Complete conversation history with evidence provenance',
        ]}
      />

      {/* ── SLIDE 7 — Evidence Provenance ───────────────────────────── */}
      <SystemDetailSection
        label="06 / Evidence Provenance"
        title="Complete transparency into reasoning with traceable evidence."
        body="Every answer provided by Vajra includes detailed provenance—showing exactly what data was retrieved, which SQL queries were executed, and how evidence was scored and validated."
        bullets={[
          'Evidence panel with confidence scoring (0-1 scale)',
          'SQL trace showing all database queries executed',
          'Retrieval operations with timing and result counts',
          'Evidence quality scoring across 7 dimensions',
          'Contradiction detection between evidence sources',
          'Complete reasoning trace for audit and verification',
        ]}
      />

      {/* ── SLIDE 8 — Explainable AI ───────────────────────────── */}
      <SystemDetailSection
        label="07 / Explainable AI"
        title="Transparent reasoning you can trust."
        body="Every answer comes with complete explainability—showing what evidence was retrieved, how it was validated, and how the reasoning was constructed. Users can verify AI reasoning at every step."
        bullets={[
          'Evidence quality scores showing reliability and relevance',
          'Complete SQL queries and data sources for each answer',
          'Retrieval trace showing search operations performed',
          'Hypothesis generation and evaluation transparency',
          'Root cause reasoning chain with supporting evidence',
          'Confidence scoring at both evidence and answer levels',
        ]}
      />

      {/* ── SLIDE 9 — Edge Deployment ──────────────────────────── */}
      <SystemDetailSection
        label="08 / Deployment"
        title="Edge-native deployment with complete data sovereignty."
        body="Vajra Cortex runs entirely on local hardware within your facility. No production data or images leave your network. Full offline operation with no cloud dependency."
        bullets={[
          'Local GPU-accelerated inference for real-time performance',
          'Sub-second response times for production-speed operation',
          'Complete data sovereignty—all data stays on-premise',
          'Offline-capable with no internet requirement',
          'Direct integration with ERP, MES, and SQL databases',
          'Automatic model updates via secure local deployment',
        ]}
      />

      {/* ── SLIDE 10 — Manufacturing Memory ───────────────────────────── */}
      <SystemDetailSection
        label="09 / Manufacturing Memory"
        title="Continuous learning from production history."
        body="Vajra Cortex maintains a comprehensive manufacturing memory—tracking defect patterns, process conditions, and quality trends across production cycles. This enables pattern recognition and proactive problem identification."
        bullets={[
          'Complete history of inspections with manufacturing context',
          'Defect fingerprinting and pattern recognition',
          'Correlation analysis between defects and process variables',
          'Recurring issue identification across heats and batches',
          'Predictive alerts based on historical patterns',
        ]}
      />

      {/* ── SLIDE 11 — Business Impact ───────────────────────────── */}
      <SystemDetailSection
        label="10 / Business Impact"
        title="Measurable impact on quality, efficiency, and decision-making."
        body="Vajra Cortex transforms manufacturing intelligence by providing consistent AI-powered decisions, reducing quality variation, and enabling data-driven continuous improvement."
      >
        <SystemImpactGrid
          operational={[
            'Consistent quality decisions across all shifts and operators',
            'Faster root cause analysis with AI-powered investigations',
            'Reduced inspection time with automated defect detection',
            'Improved operator productivity with decision support',
          ]}
          strategic={[
            'Data-driven quality improvement with pattern recognition',
            'Scalable expertise deployment across multiple facilities',
            'Traceable decision intelligence for compliance and audit',
            'Continuous learning and model improvement from feedback',
          ]}
        />
      </SystemDetailSection>

      {/* ── SLIDE 12 — Download / Contact ──────────── */}
      <DownloadPresentationButton productName="Vajra_Cortex" />

    </div>
  )
}
