import { Link } from 'react-router-dom'
import { SystemDetailSection } from '../../components/systems/SystemDetailSection'
import { SystemImageBlock } from '../../components/systems/SystemImageBlock'
import { SystemWorkflow } from '../../components/systems/SystemWorkflow'
import { SystemImpactGrid } from '../../components/systems/SystemImpactGrid'
import { DownloadPresentationButton } from '../../components/DownloadPresentationButton'
import { useDocumentHead } from '../../hooks/useDocumentHead'

/**
 * MedhasCortex — Manufacturing Intelligence Platform Product Page
 * Route: /products/medhas-cortex
 * 
 * Comprehensive platform combining inspection intelligence (RAS),
 * process analytics (PI), SPC monitoring, and quality frameworks.
 */
export function MedhasCortex() {
  useDocumentHead(
    'Medhas Cortex — Manufacturing Intelligence Platform | Tvastr',
    'Comprehensive manufacturing intelligence platform combining inspection intelligence, process analytics, SPC monitoring, and quality frameworks for operational excellence.',
    'https://tvastr.co/products/medhas-cortex'
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
        <span className="text-xs text-slate-400 tracking-wide hidden sm:block">Medhas Cortex</span>
      </div>

      {/* ── SLIDE 1 — Title ───────────────────────────────────────── */}
      <section className="presentation-slide" style={{ background: '#ffffff' }}>
        <div className="max-w-[900px] mx-auto px-6 md:px-8 py-16 md:py-20 w-full">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-400 mb-6">
            Tvastr · Industrial AI Platform
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
            Medhas Cortex
          </h1>
          <p className="text-xl text-slate-500 font-light max-w-[680px] leading-relaxed">
            Comprehensive manufacturing intelligence platform combining inspection intelligence, process analytics, SPC monitoring, and quality frameworks for operational excellence and continuous improvement.
          </p>
        </div>
        <div className="slide-footer">
          <span>Tvastr</span>
          <span>Medhas Cortex</span>
          <span className="slide-number" />
        </div>
      </section>

      {/* ── SLIDE 2 — Platform Overview ─────────────────────────────────── */}
      <SystemDetailSection
        label="01 / Platform Overview"
        title="Unified manufacturing intelligence from inspection to optimization."
        body="Medhas Cortex integrates multiple intelligence layers into one cohesive platform—from real-time inspection at quality gates to plant-wide analytics and continuous improvement frameworks."
      >
        <div className="mt-6 p-5" style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', maxWidth: '680px' }}>
          <p className="text-sm font-bold text-gray-800 mb-4">Integrated Intelligence Layers</p>
          <div className="space-y-3">
            {[
              { name: 'Rejection Analysis System (RAS)', desc: 'Real-time inspection intelligence at quality gates' },
              { name: 'Plant Intelligence (PI)', desc: 'Process analytics and quality insights' },
              { name: 'Statistical Process Control (SPC)', desc: 'Automated monitoring and trend detection' },
              { name: 'Quality Frameworks', desc: 'FMEA, Fishbone, Pareto analysis tools' },
            ].map(({ name, desc }) => (
              <div key={name}>
                <p className="text-sm font-semibold text-gray-700">{name}</p>
                <p className="text-sm text-slate-600 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </SystemDetailSection>

      {/* ── SLIDE 3 — The Problem ─────────────────────────────────── */}
      <SystemDetailSection
        label="02 / The Problem"
        title="Disconnected systems create blind spots in manufacturing operations."
        body="Most manufacturing facilities operate with separate systems for inspection, quality tracking, and process analytics. This fragmentation prevents comprehensive understanding of quality issues and limits improvement efforts."
        bullets={[
          'Inspection data disconnected from process analytics',
          'Quality issues identified too late in production',
          'Manual data aggregation and analysis requirements',
          'Difficulty correlating defects to process conditions',
          'Limited visibility into recurring quality patterns',
          'Siloed knowledge between shifts and departments',
        ]}
      />

      {/* ── SLIDE 4 — Integrated Intelligence ───────────────────────────── */}
      <SystemDetailSection
        label="03 / Integrated Intelligence"
        title="One platform connecting all quality and process intelligence."
        body="Medhas Cortex provides a unified view from inspection through analytics, enabling seamless flow of intelligence across your manufacturing operations."
      >
        <SystemWorkflow
          steps={[
            'Real-Time Inspection',
            'Defect Detection',
            'Quality Data Collection',
            'Process Analytics',
            'Pattern Recognition',
            'SPC Monitoring',
            'Trend Analysis',
            'Root Cause ID',
            'Corrective Actions',
          ]}
          outputs={['Quality Intelligence', 'Process Optimization', 'Continuous Improvement']}
        />
      </SystemDetailSection>

      {/* ── SLIDE 5 — Rejection Analysis System ──────────────────────── */}
      <SystemDetailSection
        label="04 / Rejection Analysis System (RAS)"
        title="Real-time inspection intelligence at every quality gate."
        body="Automated defect detection and classification with AI-powered analysis. Complete traceability linking defects to manufacturing context including heat numbers, molds, shifts, and operators."
      >
        <SystemImageBlock
          src="/inspection_tab.png"
          alt="Medhas Cortex — Rejection Analysis System"
          caption="Real-time inspection interface with AI-powered defect detection and manufacturing context capture."
        />
      </SystemDetailSection>

      {/* ── SLIDE 6 — Plant Intelligence ──────────────────────── */}
      <SystemDetailSection
        label="05 / Plant Intelligence (PI)"
        title="Process analytics and quality insights for continuous improvement."
        body="Aggregates inspection data into actionable insights—defect trends, heat-level analysis, process correlations, and quality metrics that drive improvement initiatives."
      >
        <SystemImageBlock
          src="/process_intelligence_tab.png"
          alt="Medhas Cortex — Plant Intelligence"
          caption="Process analytics dashboard with SPC charts, defect trends, and manufacturing intelligence."
        />
      </SystemDetailSection>

      {/* ── SLIDE 7 — SPC Monitoring ───────────────────────────── */}
      <SystemDetailSection
        label="06 / Statistical Process Control"
        title="Automated SPC monitoring with early warning indicators."
        body="Real-time statistical process control charts track quality metrics across production. Automatic detection of trends, shifts, and out-of-control conditions with alerts for corrective action."
        bullets={[
          'X-bar and R charts for process monitoring',
          'Automated control limit calculations',
          'Trend detection and pattern recognition',
          'Out-of-control condition alerts',
          'Process capability analysis (Cp, Cpk)',
          'Multi-variate monitoring across parameters',
        ]}
      />

      {/* ── SLIDE 8 — Quality Frameworks ───────────────────────────── */}
      <SystemDetailSection
        label="07 / Quality Engineering Frameworks"
        title="Structured problem-solving with quality engineering tools."
        body="Integrated quality frameworks help teams systematically identify root causes and implement effective corrective actions using proven methodologies."
        bullets={[
          'FMEA (Failure Mode and Effects Analysis)',
          'Fishbone (Ishikawa) diagrams for root cause analysis',
          'Pareto analysis for prioritizing quality issues',
          '5 Whys methodology for deep problem exploration',
          'Control plans and reaction plans',
          'Corrective action tracking and verification',
        ]}
      />

      {/* ── SLIDE 9 — Multi-Gate Intelligence ───────────────────────────── */}
      <SystemDetailSection
        label="08 / Multi-Gate Intelligence"
        title="Connected intelligence across the entire production line."
        body="Track quality across all inspection gates—from pattern and core through final inspection. Understand how defects propagate and where issues originate in the production process."
        bullets={[
          'Quality tracking across all production stages',
          'Defect pattern recognition across gates',
          'Upstream cause identification for downstream issues',
          'Gate-specific quality metrics and trends',
          'Process section attribution for targeted improvement',
        ]}
      />

      {/* ── SLIDE 10 — Traceability ──────────────────────────────── */}
      <SystemDetailSection
        label="09 / Complete Traceability"
        title="Full manufacturing context for every quality decision."
        body="Every inspection and quality event is linked to complete manufacturing context—enabling deep analysis and compliance reporting."
        bullets={[
          'Heat number and batch traceability',
          'Mold and tooling identification',
          'Shift and operator tracking',
          'Process parameter linkage',
          'Material specifications and supplier data',
          'Complete audit trail for compliance',
        ]}
      />

      {/* ── SLIDE 11 — Decision Intelligence ───────────────────────────── */}
      <SystemDetailSection
        label="10 / Decision Intelligence"
        title="AI-powered recommendations for corrective actions."
        body="Medhas Cortex analyzes quality patterns and process conditions to recommend prioritized corrective actions—helping teams focus on the highest-impact improvements."
        bullets={[
          'Automated pattern recognition in quality data',
          'Root cause correlation with process variables',
          'Prioritized corrective action recommendations',
          'Impact assessment for proposed changes',
          'Verification of improvement effectiveness',
        ]}
      />

      {/* ── SLIDE 12 — Edge Deployment ──────────────────────────── */}
      <SystemDetailSection
        label="11 / Deployment"
        title="Edge-native platform with complete data sovereignty."
        body="Medhas Cortex runs entirely on-premise with full offline capability. All manufacturing and quality data stays within your facility with no cloud dependency."
        bullets={[
          'Local deployment on dedicated industrial hardware',
          'Complete data sovereignty and security',
          'Offline-capable with no internet requirement',
          'ERP and MES integration via standard protocols',
          'Multi-plant deployment with centralized management',
          'Automatic updates via secure local deployment',
        ]}
      />

      {/* ── SLIDE 13 — Business Impact ───────────────────────────── */}
      <SystemDetailSection
        label="12 / Business Impact"
        title="Measurable improvements in quality, efficiency, and cost."
        body="Medhas Cortex delivers comprehensive manufacturing intelligence that drives measurable business outcomes across operational and strategic dimensions."
      >
        <SystemImpactGrid
          operational={[
            'Reduced quality defects through early detection',
            'Faster root cause identification and resolution',
            'Consistent quality standards across all shifts',
            'Improved operator productivity with decision support',
          ]}
          strategic={[
            'Data-driven continuous improvement initiatives',
            'Reduced scrap and rework costs',
            'Enhanced compliance and traceability for audit',
            'Scalable quality management across facilities',
          ]}
        />
      </SystemDetailSection>

      {/* ── SLIDE 14 — Download / Contact ──────────── */}
      <DownloadPresentationButton productName="Medhas_Cortex" />

    </div>
  )
}
