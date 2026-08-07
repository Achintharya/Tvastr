import { Link } from 'react-router-dom'
import { SystemDetailSection } from '../../components/systems/SystemDetailSection'
import { SystemImageBlock } from '../../components/systems/SystemImageBlock'
import { SystemImpactGrid } from '../../components/systems/SystemImpactGrid'
import { DownloadPresentationButton } from '../../components/DownloadPresentationButton'
import { useDocumentHead } from '../../hooks/useDocumentHead'

/**
 * ExecutiveMISCortex — Executive Decision Intelligence Product Page
 * Route: /products/executive-mis-cortex
 * 
 * Real-time executive dashboards providing C-suite visibility
 * across multiple plants with business intelligence and strategic KPIs.
 */
export function ExecutiveMISCortex() {
  useDocumentHead(
    'Executive MIS Cortex — Executive Decision Intelligence | Tvastr',
    'Real-time executive intelligence platform providing C-suite visibility across multiple manufacturing plants with business intelligence, strategic KPIs, and decision support.',
    'https://tvastr.co/products/executive-mis-cortex'
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
        <span className="text-xs text-slate-400 tracking-wide hidden sm:block">Executive MIS Cortex</span>
      </div>

      {/* ── SLIDE 1 — Title ───────────────────────────────────────── */}
      <section className="presentation-slide" style={{ background: '#ffffff' }}>
        <div className="max-w-[900px] mx-auto px-6 md:px-8 py-16 md:py-20 w-full">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-400 mb-6">
            Tvastr · Industrial AI Platform
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
            Executive MIS Cortex
          </h1>
          <p className="text-xl text-slate-500 font-light max-w-[680px] leading-relaxed">
            Real-time executive intelligence platform providing C-suite visibility across multiple manufacturing plants with business intelligence, strategic KPIs, and data-driven decision support.
          </p>
        </div>
        <div className="slide-footer">
          <span>Tvastr</span>
          <span>Executive MIS Cortex</span>
          <span className="slide-number" />
        </div>
      </section>

      {/* ── SLIDE 2 — The Problem ─────────────────────────────────── */}
      <SystemDetailSection
        label="01 / The Problem"
        title="Executives lack real-time visibility into manufacturing operations."
        body="C-suite leaders make strategic decisions based on delayed reports and fragmented data. Without real-time operational intelligence, they react to problems instead of preventing them."
        bullets={[
          'Delayed reporting—weekly or monthly operational summaries',
          'Fragmented data across multiple plants and systems',
          'Limited visibility into quality, cost, and efficiency metrics',
          'Difficulty benchmarking performance across facilities',
          'Manual data aggregation consuming valuable time',
          'Reactive decision-making based on historical trends',
        ]}
      />

      {/* ── SLIDE 3 — The Solution ───────────────────────────────── */}
      <SystemDetailSection
        label="02 / The Solution"
        title="Real-time executive intelligence for strategic decision-making."
        body="Executive MIS Cortex aggregates operational data across your entire manufacturing enterprise, providing real-time visibility into key performance indicators, quality trends, and business outcomes."
      >
        <div className="mt-6 p-5" style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', maxWidth: '680px' }}>
          <p className="text-sm font-bold text-gray-800 mb-4">Executive Intelligence Layers</p>
          <div className="space-y-3">
            {[
              { name: 'Multi-Plant Dashboards', desc: 'Real-time visibility across all manufacturing facilities' },
              { name: 'Strategic KPIs', desc: 'OEE, yield, quality metrics, cost analysis' },
              { name: 'Business Intelligence', desc: 'Trend analysis, forecasting, and predictive insights' },
              { name: 'Decision Support', desc: 'AI-powered recommendations for strategic actions' },
            ].map(({ name, desc }) => (
              <div key={name}>
                <p className="text-sm font-semibold text-gray-700">{name}</p>
                <p className="text-sm text-slate-600 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </SystemDetailSection>

      {/* ── SLIDE 4 — Executive Dashboards ──────────────────────── */}
      <SystemDetailSection
        label="03 / Executive Dashboards"
        title="Real-time visibility across your entire manufacturing enterprise."
        body="Unified dashboards provide at-a-glance insights into operational performance, quality metrics, and business outcomes across all facilities."
        bullets={[
          'Real-time KPI cards for critical metrics across all plants',
          'Multi-plant comparison views with side-by-side performance',
          'Trend visualization showing historical performance patterns',
          'Alert indicators for metrics exceeding thresholds',
          'Quick-access navigation to department-specific dashboards',
          'Executive summary with key highlights and action items',
        ]}
      />

      {/* ── SLIDE 5 — Strategic KPIs ───────────────────────────── */}
      <SystemDetailSection
        label="04 / Strategic KPIs"
        title="Key performance indicators that drive business decisions."
        body="Track the metrics that matter most to your organization—from operational efficiency and quality performance to cost management and capacity utilization."
        bullets={[
          'Overall Equipment Effectiveness (OEE) by plant and line',
          'First-pass yield and quality metrics',
          'Production capacity and utilization rates',
          'Scrap and rework costs with financial impact',
          'On-time delivery performance',
          'Labor productivity and efficiency metrics',
        ]}
      />

      {/* ── SLIDE 6 — Quality Intelligence ──────────────────────── */}
      <SystemDetailSection
        label="05 / Quality Intelligence"
        title="Enterprise-wide quality visibility and trend analysis."
        body="Understand quality performance across all facilities with real-time defect tracking, rejection rates, and quality cost analysis."
        bullets={[
          'Real-time defect tracking by type, line, and product',
          'First-pass yield and rejection rate trends over time',
          'Defect pareto analysis showing top quality issues',
          'Quality cost tracking (scrap, rework, warranty)',
          'Customer complaint monitoring and response tracking',
          'Comparative quality metrics across plants and shifts',
        ]}
      />

      {/* ── SLIDE 7 — Cost Analytics ───────────────────────────── */}
      <SystemDetailSection
        label="06 / Cost Analytics"
        title="Financial visibility into quality and operational costs."
        body="Track the financial impact of quality issues, production efficiency, and operational performance with real-time cost analytics."
        bullets={[
          'Scrap and rework cost tracking by product and facility',
          'Cost of poor quality (COPQ) analysis and trending',
          'Production cost per unit with variance analysis',
          'Material waste and yield loss financial impact',
          'Maintenance costs and downtime expense tracking',
          'ROI calculation for quality improvement initiatives',
        ]}
      />

      {/* ── SLIDE 8 — Multi-Plant Intelligence ───────────────────────────── */}
      <SystemDetailSection
        label="07 / Multi-Plant Intelligence"
        title="Aggregate and compare performance across all facilities."
        body="Benchmark performance between plants, identify best practices, and drive consistency across your manufacturing network."
        bullets={[
          'Side-by-side plant performance comparison',
          'Best practice identification and sharing',
          'Consistency tracking across facilities',
          'Resource allocation optimization',
          'Capacity balancing and load management',
          'Cross-plant quality and efficiency benchmarking',
        ]}
      />

      {/* ── SLIDE 9 — Alerts & Notifications ───────────────────────────── */}
      <SystemDetailSection
        label="08 / Alert Management"
        title="Proactive notifications for critical operational events."
        body="Stay informed of critical issues with intelligent alert management—receiving notifications only for events that require executive attention."
        bullets={[
          'Configurable alerts for KPI thresholds',
          'Quality incident notifications with severity levels',
          'Production disruption and downtime alerts',
          'Cost overrun and budget deviation warnings',
          'Trend-based predictive alerts',
          'Mobile notifications for on-the-go access',
        ]}
      />

      {/* ── SLIDE 10 — Business Intelligence ───────────────────────────── */}
      <SystemDetailSection
        label="09 / Business Intelligence"
        title="Advanced analytics and forecasting for strategic planning."
        body="Go beyond real-time monitoring with predictive analytics, trend forecasting, and scenario analysis to inform strategic decisions."
        bullets={[
          'Historical trend analysis and pattern recognition',
          'Predictive forecasting for quality and production',
          'Scenario modeling for strategic planning',
          'Root cause analysis for recurring issues',
          'Correlation analysis between operational variables',
          'Data-driven improvement opportunity identification',
        ]}
      />

      {/* ── SLIDE 11 — Decision Support ───────────────────────────── */}
      <SystemDetailSection
        label="10 / Decision Support"
        title="AI-powered recommendations for strategic actions."
        body="Executive MIS Cortex analyzes operational patterns and business metrics to recommend strategic actions—helping leadership focus on high-impact initiatives."
        bullets={[
          'Priority ranking of operational issues',
          'Investment opportunity identification',
          'Resource allocation recommendations',
          'Capacity expansion analysis',
          'Risk assessment and mitigation strategies',
          'ROI projections for improvement initiatives',
        ]}
      />

      {/* ── SLIDE 12 — Executive Reporting ───────────────────────────── */}
      <SystemDetailSection
        label="11 / Executive Reporting"
        title="Automated reporting for board meetings and stakeholders."
        body="Generate comprehensive executive reports with one click—presenting key insights, trends, and recommendations in presentation-ready format."
        bullets={[
          'Automated monthly and quarterly reports',
          'Customizable report templates by stakeholder',
          'Export to PDF and PowerPoint formats',
          'Executive summary with key highlights',
          'Detailed metrics and supporting data',
          'Visual charts and trend visualizations',
        ]}
      />

      {/* ── SLIDE 13 — Mobile Access ───────────────────────────── */}
      <SystemDetailSection
        label="12 / Mobile Access"
        title="Manufacturing intelligence wherever you are."
        body="Access executive dashboards and receive critical alerts from any device—enabling informed decision-making whether you're in the office, on the plant floor, or traveling."
        bullets={[
          'Responsive design for mobile and tablet devices',
          'Real-time KPI monitoring on the go',
          'Push notifications for critical alerts',
          'Quick access to key metrics and reports',
          'Secure authentication and role-based access',
        ]}
      />

      {/* ── SLIDE 14 — Data Security ──────────────────────────── */}
      <SystemDetailSection
        label="13 / Security & Access Control"
        title="Enterprise-grade security with role-based access."
        body="Executive MIS Cortex provides robust security controls ensuring sensitive business intelligence is accessible only to authorized personnel."
        bullets={[
          'Role-based access control (RBAC) by management level',
          'Multi-factor authentication (MFA) support',
          'Audit trails for all data access and changes',
          'Encrypted data transmission and storage',
          'On-premise deployment for complete data sovereignty',
          'Compliance with industry security standards',
        ]}
      />

      {/* ── SLIDE 15 — Business Impact ───────────────────────────── */}
      <SystemDetailSection
        label="14 / Business Impact"
        title="Strategic visibility that drives business performance."
        body="Executive MIS Cortex empowers leadership with real-time intelligence for faster, more informed strategic decisions that improve business outcomes."
      >
        <SystemImpactGrid
          operational={[
            'Real-time visibility eliminating reporting delays',
            'Faster issue identification and response',
            'Improved resource allocation across facilities',
            'Enhanced operational efficiency through benchmarking',
          ]}
          strategic={[
            'Data-driven strategic planning and decision-making',
            'Proactive issue prevention through predictive analytics',
            'Optimized capital investment based on performance data',
            'Enterprise-wide continuous improvement culture',
          ]}
        />
      </SystemDetailSection>

      {/* ── SLIDE 16 — Download / Contact ──────────── */}
      <DownloadPresentationButton productName="Executive_MIS_Cortex" />

    </div>
  )
}
