import { Link } from 'react-router-dom'
import { SystemDetailSection } from '../../components/systems/SystemDetailSection'
import { SystemImageBlock } from '../../components/systems/SystemImageBlock'
import { SystemWorkflow } from '../../components/systems/SystemWorkflow'
import { SystemImpactGrid } from '../../components/systems/SystemImpactGrid'
import { DownloadPresentationButton } from '../../components/DownloadPresentationButton'
import { useDocumentHead } from '../../hooks/useDocumentHead'

/**
 * PIRASCortex — Plant Intelligence & Rejection Analysis System Product Page
 * Route: /products/piras
 *
 * Comprehensive platform combining inspection intelligence (RAS),
 * process analytics (PI), SPC monitoring, and quality frameworks.
 *
 * Legacy redirect: /products/medhas-cortex → /products/piras (see App.jsx)
 */
export function PIRASCortex() {
  useDocumentHead(
    'PIRAS — Plant Intelligence & Rejection Analysis System | Tvastr',
    'Comprehensive manufacturing intelligence platform combining inspection intelligence, process analytics, SPC monitoring, and quality frameworks for operational excellence.',
    'https://tvastr.co/products/piras'
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
        <span className="text-xs text-slate-400 tracking-wide hidden sm:block">PIRAS</span>
      </div>

      {/* ── SLIDE 1 — Title ───────────────────────────────────────── */}
      <section className="presentation-slide" style={{ background: '#ffffff' }}>
        <div className="max-w-[900px] mx-auto px-6 md:px-8 py-16 md:py-20 w-full">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-400 mb-6">
            Tvastr · Industrial AI Platform
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
            PIRAS
          </h1>
          <p className="text-base font-medium text-slate-500 mb-2">
            Plant Intelligence &amp; Rejection Analysis System
          </p>
          <p className="text-xl text-slate-500 font-light max-w-[680px] leading-relaxed">
            Comprehensive manufacturing intelligence platform combining inspection intelligence, process analytics, SPC monitoring, and quality frameworks for operational excellence and continuous improvement.
          </p>
        </div>
        <div className="slide-footer">
          <span>Tvastr</span>
          <span>PIRAS</span>
          <span className="slide-number" />
        </div>
      </section>

      {/* ── SLIDE 2 — Platform Overview ─────────────────────────────────── */}
      <SystemDetailSection
        label="01 / Platform Overview"
        title="Unified manufacturing intelligence from inspection to optimization."
        body="PIRAS integrates multiple intelligence layers into one cohesive platform—from real-time inspection at quality gates to plant-wide analytics and continuous improvement frameworks."
      >
        <div className="mt-6 p-5" style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', maxWidth: '680px' }}>
          <p className="text-sm font-bold text-gray-800 mb-4">Integrated Intelligence Layers</p>
          <div className="space-y-3">
            {[
              { name: 'Rejection Analysis System (RAS)', desc: 'Real-time inspection intelligence at quality gates' },
              { name: 'Plant Intelligence (PI)', desc: 'Process analytics, trends, and quality insights' },
              { name: 'Statistical Process Control (SPC)', desc: 'Automated monitoring with control limits' },
              { name: 'Quality Engineering', desc: 'FMEA, Fishbone, Pareto analysis frameworks' },
            ].map((layer) => (
              <div key={layer.name} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: '#0369a1' }} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{layer.name}</p>
                  <p className="text-xs text-gray-500">{layer.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SystemDetailSection>

      {/* ── SLIDE 3 — Inspection Intelligence ─────────────────────── */}
      <SystemDetailSection
        label="02 / Inspection Intelligence"
        title="Real-time defect detection at every quality gate."
        body="PIRAS delivers AI-powered inspection intelligence directly at the point of production—providing immediate quality decisions with full defect analysis and traceability."
        bullets={[
          'Computer vision defect detection across all casting surfaces',
          'Multi-signal fusion (YOLO + Signal Classifier + LLM)',
          'Sub-100ms inspection decisions for production-speed operation',
          'Defect type classification with confidence scoring',
          'Rejection vs. pass decisions with evidence documentation',
          'Batch processing for high-volume production environments',
        ]}
      />

      {/* ── SLIDE 4 — Process Analytics ─────────────────────────── */}
      <SystemDetailSection
        label="03 / Process Analytics"
        title="Deep manufacturing intelligence beyond individual inspections."
        body="PIRAS continuously analyses production data to surface trends, anomalies, and improvement opportunities across heats, shifts, and time periods."
        bullets={[
          'Defect trend analysis across production periods',
          'Heat-level quality intelligence and correlation',
          'Shift and operator performance tracking',
          'Process parameter correlation with quality outcomes',
          'Temporal pattern detection and early warning',
          'Multi-dimensional defect clustering and analysis',
        ]}
      />

      {/* ── SLIDE 5 — SPC ─────────────────────────────── */}
      <SystemDetailSection
        label="04 / Statistical Process Control"
        title="Automated SPC with real-time process capability monitoring."
        body="PIRAS implements statistical process control across key quality metrics—automatically detecting process drift before it generates defects."
        bullets={[
          'Control charts (X-bar, R, P, NP, C, U) across quality metrics',
          'Automated control limit calculation and updating',
          'Process capability indices (Cp, Cpk, Pp, Ppk)',
          'Out-of-control signal detection and alerting',
          'Special cause variation identification',
          'SPC data export for quality audits',
        ]}
      />

      {/* ── SLIDE 6 — Quality Engineering ───────────────────────── */}
      <SystemDetailSection
        label="05 / Quality Engineering"
        title="Structured quality frameworks integrated into production workflow."
        body="PIRAS provides built-in quality engineering tools—FMEA, Fishbone, and Pareto analysis—directly connected to live inspection data."
        bullets={[
          'FMEA with risk priority number (RPN) calculation',
          'Fishbone (Ishikawa) diagrams linked to defect data',
          'Pareto analysis for defect type prioritization',
          'Quality gate performance metrics and trends',
          'Corrective action tracking and verification',
          'Quality engineering reports for management review',
        ]}
      />

      {/* ── SLIDE 7 — Plant Intelligence Dashboard ───────────────── */}
      <SystemDetailSection
        label="06 / Plant Intelligence Dashboard"
        title="Complete operational visibility across your production facility."
        body="The PIRAS plant intelligence dashboard provides real-time and historical visibility across all quality dimensions—from individual part results to plant-wide performance metrics."
        bullets={[
          'Live rejection rate and defect count monitoring',
          'Heat and batch quality scorecards',
          'Defectograph — spatial defect heatmaps on casting geometry',
          'Shift comparison and performance benchmarking',
          'Cost of quality tracking and financial impact metrics',
          'Customisable KPI dashboards for management reporting',
        ]}
      />


      {/* ── SLIDE 8 — ERP Integration ────────────────────────────── */}
      <SystemDetailSection
        label="07 / ERP Integration"
        title="Seamless connection to your production data infrastructure."
        body="PIRAS integrates directly with ERP and MES systems—automatically linking every inspection to its production context for complete traceability."
        bullets={[
          'Direct SQL Server integration for Production_Daywise data',
          'Automatic heat number and batch resolution',
          'Mould, shift, and operator context linking',
          'Material and alloy specification retrieval',
          'Customer and order traceability',
          'Bidirectional data flow for quality feedback to ERP',
        ]}
      />

      {/* ── SLIDE 9 — Multi-Gate Intelligence ───────────────────── */}
      <SystemDetailSection
        label="08 / Multi-Gate Intelligence"
        title="Quality intelligence across the entire production line."
        body="PIRAS supports multiple inspection gates across the production process—providing unified quality intelligence from raw casting through final inspection."
        bullets={[
          'Multiple quality gate configuration and management',
          'Cross-gate defect correlation and attribution',
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
        body="PIRAS analyzes quality patterns and process conditions to recommend prioritized corrective actions—helping teams focus on the highest-impact improvements."
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
        body="PIRAS runs entirely on-premise with full offline capability. All manufacturing and quality data stays within your facility with no cloud dependency."
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
        body="PIRAS delivers comprehensive manufacturing intelligence that drives measurable business outcomes across operational and strategic dimensions."
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
      <DownloadPresentationButton productName="PIRAS" />

    </div>
  )
}

