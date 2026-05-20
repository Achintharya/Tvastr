import { Link, useLocation } from 'react-router-dom'
import { SystemDetailSection } from '../../components/systems/SystemDetailSection'
import { SystemImageBlock } from '../../components/systems/SystemImageBlock'
import { SystemImpactGrid } from '../../components/systems/SystemImpactGrid'
import { DownloadPresentationButton } from '../../components/DownloadPresentationButton'
import { useDocumentHead } from '../../hooks/useDocumentHead'

/**
 * PlantIntelligence — Technical detail page.
 * Light industrial theme. Structured like a consulting presentation deck.
 * Each section maps to one PDF slide via .presentation-slide class.
 * Routes: /systems/plant-intelligence (public) OR /portal/pi (protected)
 *
 * Part of the TvastrAI Unified Industrial Cognition Runtime.
 * PI = Process Intelligence Layer (manufacturing analytics, SPC, temporal insights)
 * 
 * Screenshot slides use images from /public/:
 *   overview_tab.png       — Overview dashboard
 *   aiquery_tab.png        — AI Query interface
 *   decisions_tab.png      — Decision Intelligence
 *   alerts_tab.png         — Alerts interface
 */
export function PlantIntelligence() {
  const location = useLocation()
  const isPortalRoute = location.pathname.startsWith('/portal')

  useDocumentHead(
    'Plant Intelligence — Process Analytics & Manufacturing Intelligence | Tvastr Industrial Intelligence',
    'Manufacturing process analytics within a unified industrial cognition runtime. SPC, drift detection, decision intelligence, and conversational data access.',
    'https://tvastr.co/systems/plant-intelligence'
  )

  return (
    <div id="presentation-root" style={{ background: '#ffffff', color: '#111827' }}>

      {/* ── Top nav (not a slide — excluded from PDF) ─────────────── */}
      {/* Hide this nav when in portal context — portal pages have their own navigation */}
      {!isPortalRoute && (
        <div
          className="sticky top-0 z-40 flex items-center justify-between px-6 md:px-12 h-14"
          style={{ background: 'rgba(255,255,255,0.95)', borderBottom: '1px solid #e5e7eb', backdropFilter: 'blur(8px)' }}
        >
          <Link to="/" className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 hover:text-slate-700 transition-colors">
            ← Tvastr
          </Link>
          <span className="text-xs text-slate-400 tracking-wide hidden sm:block">Plant Intelligence</span>
        </div>
      )}

      {/* ── SLIDE 1 — Title + Positioning ────────────────────────── */}
      <section className="presentation-slide" style={{ background: '#ffffff' }}>
        <div className="max-w-[900px] mx-auto px-6 md:px-8 py-16 md:py-20 w-full">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-400 mb-6">
            Tvastr · Industrial Cognition Runtime
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
            Plant Intelligence
          </h1>
          <p className="text-xl text-slate-500 font-light max-w-[680px] leading-relaxed mb-3">
            The process intelligence layer of the Tvastr industrial cognition runtime. Transforms inspection and production data into plant-level manufacturing analytics and operational insights.
          </p>
        </div>
        <div className="slide-footer">
          <span>Tvastr</span>
          <span>Plant Intelligence</span>
          <span className="slide-number" />
        </div>
      </section>

      {/* ── SLIDE 2 — Unified Runtime Layers ────────────────────────── */}
      <SystemDetailSection
        label="01 / Runtime Architecture"
        title="Process Layer within Unified Industrial Runtime"
        body="Plant Intelligence operates as the process analytics layer within the same unified cognition runtime. Inspection data flows directly into process analytics with no separate systems or integration gaps."
      >
        <div className="mt-6 flex flex-col items-stretch gap-0" style={{ maxWidth: '600px' }}>
          {/* Card 1 — Inspection Layer */}
          <div className="p-5" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px 8px 0 0' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0" />
              <p className="text-sm font-bold text-gray-800">Inspection Intelligence Layer</p>
            </div>
            <p className="text-xs text-slate-400 mb-3">Real-time operational intelligence.</p>
            <ul className="space-y-1.5">
              {['Defect detection and classification','Root cause diagnostics','Traceable inspection records','Shop-floor decision support'].map((c, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />{c}
                </li>
              ))}
            </ul>
          </div>
          {/* Connector */}
          <div className="flex items-center justify-center h-8" style={{ borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>
            <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
              <path d="M7 0v14M1 10l6 8 6-8" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {/* Card 2 — Process Layer */}
          <div className="p-5" style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '0 0 8px 8px' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-sky-400 flex-shrink-0" />
              <p className="text-sm font-bold text-gray-800">Process Intelligence Layer</p>
            </div>
            <p className="text-xs text-slate-400 mb-3">Plant-level manufacturing analytics.</p>
            <ul className="space-y-1.5">
              {['Rejection trend analysis','Defect pattern detection','Process risk scoring','Statistical process control','Quality engineering frameworks'].map((c, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1 h-1 rounded-full bg-sky-300 flex-shrink-0" />{c}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-5 text-sm text-slate-500 italic" style={{ maxWidth: '600px' }}>
          Both layers operate within the same unified runtime. Data flows automatically from inspection to process analytics.
        </p>
      </SystemDetailSection>

      {/* ── SLIDE 3 — Plant-Level Quality Analytics ──────────────── */}
      <SystemDetailSection
        label="02 / Analytics"
        title="Plant-Level Quality Analytics"
        body="Converts inspection and production records into measurable plant-level indicators."
      >
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Analytics Examples</p>
            <ul className="space-y-2">
              {['Rejection rate trends across time','Pareto analysis of defect types','Cluster analysis of recurring defect patterns','Spatial defect density mapping across castings'].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-5" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Engineering Value</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              These analytics allow engineers to detect quality drift and emerging defect patterns early, before they compound into larger scrap losses or process failures.
            </p>
          </div>
        </div>
      </SystemDetailSection>

      {/* ── SLIDE 4 — Plant Overview (Screenshot) ────────────────── */}
      <SystemDetailSection
        label="03 / Application — Overview"
        title="Plant Overview"
        body="The overview dashboard provides a real-time summary of plant performance, combining production data with inspection outcomes to highlight key quality indicators."
      >
        <SystemImageBlock
          src="/overview_tab.png"
          alt="Plant Intelligence — Overview Dashboard"
          caption="Plant-level KPIs including total production, rejection rate trends, and dominant defect patterns."
        />
      </SystemDetailSection>

      {/* ── SLIDE 5 — Quality Engineering Frameworks ─────────────── */}
      <SystemDetailSection
        label="04 / Quality Engineering"
        title="Integrated Quality Engineering Methods"
        body="Automatically generates structured quality analysis frameworks used by manufacturing engineers."
      >
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: 'FMEA', detail: 'Failure mode tables with calculated risk priority numbers across process stages.' },
            { name: 'Fishbone Analysis', detail: 'Root-cause analysis across 5M categories: Man, Machine, Material, Method, Milieu.' },
            { name: 'Quality Gate Analysis', detail: 'Defect yield and escape rate metrics tracked across each process stage.' },
            { name: 'TPM Risk Indicators', detail: 'Equipment-based risk indicators derived from maintenance and defect co-occurrence data.' },
          ].map((fw, i) => (
            <div key={i} className="p-5" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <p className="text-sm font-semibold text-gray-800 mb-2">{fw.name}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{fw.detail}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm text-slate-500">
          These tools convert inspection data into structured quality diagnostics.
        </p>
      </SystemDetailSection>

      {/* ── SLIDE 6 — Process Risk & SPC ─────────────────────────── */}
      <SystemDetailSection
        label="05 / Process Risk"
        title="Process Risk Monitoring"
        body="The runtime continuously monitors process stability using statistical quality methods."
      >
        <div className="mt-6 space-y-3">
          {[
            { method: 'SPC Charts', detail: 'Statistical process control charts for rejection rate, defect counts, and severity scores.' },
            { method: 'Process Capability', detail: 'Cp and Cpk metrics calculated from inspection data to measure process stability.' },
            { method: 'Rolling Defect Trends', detail: 'Moving average rejection rates across heat batches, mold configurations, and shifts.' },
            { method: 'Anomaly Detection', detail: 'Automated flagging when rejection patterns deviate significantly from baseline.' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-3 p-4"
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
              <p className="text-sm font-semibold text-gray-700 sm:w-40 flex-shrink-0">{item.method}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm text-slate-500 italic">
          These indicators help engineers identify process instability before it becomes scrap.
        </p>
      </SystemDetailSection>

      {/* ── SLIDE 7 — Cost of Quality ────────────────────────────── */}
      <SystemDetailSection
        label="06 / Cost of Quality"
        title="Cost of Quality Analytics"
        body="Quality data is translated into financial impact metrics."
      >
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { metric: 'Scrap Cost by Defect Type', detail: 'Unit scrap cost attributed to each defect category across production periods.' },
            { metric: 'Cost by Process Stage', detail: 'Quality cost contribution broken down by each stage of the casting process.' },
            { metric: 'Production Loss Impact', detail: 'Financial loss estimate from abnormal rejection rate periods versus baseline.' },
          ].map((item, i) => (
            <div key={i} className="p-5" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <p className="text-sm font-semibold text-gray-800 mb-2">{item.metric}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm text-slate-500 italic">
          This helps management prioritize improvement initiatives based on economic impact.
        </p>
      </SystemDetailSection>

      {/* ── SLIDE 8 — Natural Language Queries + Screenshot ─────── */}
      <SystemDetailSection
        label="07 / Natural Language"
        title="Natural Language Process Queries"
        body="Engineers can query plant performance using natural language. The runtime interprets queries, executes analytics, and returns structured answers from inspection and production data."
      >
        <div className="mt-6 space-y-3 mb-6">
          {[
            'Which molds produced the highest defect rate this week?',
            'Show rejection trends by heat number.',
            'Which defect types increased during the night shift?',
            'What is the rejection rate trend for sand inclusions over the last 3 months?',
            'Which process stage has the highest scrap contribution this quarter?',
          ].map((q, i) => (
            <div key={i} className="flex items-start gap-3 p-4"
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
              <span className="mt-0.5 text-xs font-mono font-semibold text-slate-300 flex-shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-sm text-gray-600 italic">&ldquo;{q}&rdquo;</p>
            </div>
          ))}
        </div>
        <SystemImageBlock
          src="/aiquery_tab.png"
          alt="Plant Intelligence — AI Query Interface"
          caption="Natural language interface for querying plant data."
        />
      </SystemDetailSection>

      {/* ── SLIDE 9 — Alerts ──────────────────────────────────────── */}
      <SystemDetailSection
        label="08 / Application — Alerts"
        title="Real-Time Alerts"
        body="The runtime generates automated alerts when process conditions exceed configured thresholds. Alerts appear in the dashboard and can trigger notifications to operators and managers."
      >
        <SystemImageBlock
          src="/alerts_tab.png"
          alt="Plant Intelligence — Alerts Interface"
          caption="Real-time alerts for rejection rate thresholds, process anomalies, and quality events."
        />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Threshold Alerts', detail: 'Triggered when rejection rates, defect counts, or severity scores exceed defined limits.' },
            { title: 'Anomaly Alerts', detail: 'Flagged when patterns deviate significantly from historical baseline.' },
            { title: 'Trend Alerts', detail: 'Surfaced when rolling metrics show consistent directional drift.' },
          ].map((item, i) => (
            <div key={i} className="p-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <p className="text-sm font-semibold text-gray-800 mb-2">{item.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </SystemDetailSection>

      {/* ── SLIDE 10 — Operational Decision Support ──────────────── */}
      <SystemDetailSection
        label="09 / Decision Support"
        title="Operational Decision Support"
        body="The process intelligence layer provides continuous monitoring of manufacturing performance."
      >
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Automated Reports', detail: 'Daily plant quality reports generated automatically from inspection and production data.' },
            { title: 'Rejection Rate Monitoring', detail: 'Continuous tracking with automated notifications when rates exceed thresholds.' },
            { title: 'Dashboard Updates', detail: 'Real-time dashboard updates reflecting the latest production and inspection data.' },
          ].map((item, i) => (
            <div key={i} className="p-5" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <p className="text-sm font-semibold text-gray-800 mb-2">{item.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm text-slate-500 italic">
          Managers can detect and respond to quality issues earlier.
        </p>
      </SystemDetailSection>

      {/* ── SLIDE 11 — Decision Intelligence (Screenshot) ────────── */}
      <SystemDetailSection
        label="10 / Application — Decisions"
        title="Decision Intelligence"
        body="Generates and prioritizes corrective actions based on defect patterns, process risk, and cost impact. Actions can be tracked over time to measure effectiveness."
      >
        <SystemImageBlock
          src="/decisions_tab.png"
          alt="Plant Intelligence — Decision Intelligence"
          caption="Ranked corrective actions generated from process signals."
        />
      </SystemDetailSection>

      {/* ── SLIDE 12 — Unified Intelligence Flow ─────────────────── */}
      <SystemDetailSection
        label="11 / Unified Intelligence"
        title="Inspection → Process → Decision"
        body="Intelligence flows continuously from casting-level inspection through plant-level process analytics to operational decisions."
      >
        <div className="mt-6 flex flex-col md:flex-row items-stretch gap-0">
          {/* LEFT — Inspection */}
          <div className="flex-1 p-5" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px 0 0 8px' }}>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 mb-4">
              Inspection Layer
            </p>
            <ul className="space-y-2">
              {['Detects defects at casting level','Records structured inspection data','Identifies likely process causes'].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
          {/* CONNECTOR */}
          <div className="flex flex-row md:flex-col items-center justify-center px-2 py-4 md:py-0" style={{ minWidth: '72px' }}>
            <svg className="hidden md:block" width="32" height="24" viewBox="0 0 32 24" fill="none">
              <path d="M0 12h26M20 6l6 6-6 6" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg className="md:hidden" width="24" height="16" viewBox="0 0 24 16" fill="none">
              <path d="M0 8h18M14 4l4 4-4 4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {/* RIGHT — Process */}
          <div className="flex-1 p-5" style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '0 8px 8px 0' }}>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 mb-4">
              Process Layer
            </p>
            <ul className="space-y-2">
              {['Analyzes plant-level quality trends','Detects process drift across production','Generates engineering insights and reports'].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-sky-400 flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-5 text-sm text-slate-500 italic text-center">
          Same runtime. Automatic data flow. No integration overhead.
        </p>
      </SystemDetailSection>

      {/* ── SLIDE 13 — Business Impact ───────────────────────────── */}
      <SystemDetailSection
        label="12 / Business Impact"
        title="Measurable impact across operational and strategic dimensions."
        body="Process intelligence reduces the time from question to insight, enabling faster decisions grounded in actual production data."
      >
        <SystemImpactGrid
          operational={[
            'Rejection rate trends visible without manual data extraction',
            'Process risk flags surfaced automatically from inspection records',
            'Quality engineering frameworks generated from live plant data',
            'Natural language queries replace spreadsheet-based analysis',
          ]}
          strategic={[
            'Unified plant quality view across inspection and production data',
            'Cost of quality analytics aligned to manufacturing priorities',
            'SPC and capability metrics integrated into daily operations',
            'Foundation for systematic process improvement programmes',
          ]}
        />
      </SystemDetailSection>

      {/* ── Download / Contact (final slide) ─────────────────────── */}
      <DownloadPresentationButton productName="Plant_Intelligence" />

    </div>
  )
}
