import { useLicense } from '../context/LicenseContext'
import { CONFIG, openContact } from '../lib/config'
import { legacyColors as colors } from '../design/colors'

/**
 * UpgradeBanner — Top-of-dashboard upgrade prompt.
 * Renders ONLY for ras_core and ras_enterprise tiers.
 * Hidden for full_stack.
 * Updated to match light theme design system.
 *
 * Shows tier-specific messaging to guide users toward higher tiers.
 */
export function UpgradeBanner() {
  const { tier } = useLicense()

  // Don't show for TIER_3 or if tier is not loaded
  if (!tier || tier === 'TIER_3') return null

  const content = {
    TIER_1: {
      title: 'You are using RAS Core',
      features: [
        'SQL and ERP integration',
        'manufacturing traceability',
        'process intelligence and drift detection',
      ],
      targetTier: 'RAS Enterprise',
      cta: 'Upgrade to Enterprise',
    },
    TIER_2: {
      title: 'You are using RAS Enterprise',
      features: [
        'Complete RAS + Plant Intelligence integration',
        'end-to-end quality intelligence pipeline',
        'decision tracking, FMEA, SPC, cost of quality',
      ],
      targetTier: 'PIRAS',
      cta: 'Upgrade to PIRAS',
    },
  }

  const config = content[tier]
  if (!config) return null

  const handleUpgrade = () => {
    // Open contact for upgrade request
    const template = CONFIG.emailTemplates.licenseUpgrade(config.targetTier)
    openContact(CONFIG.emails.support, template.subject, template.body)
  }

  return (
    <div
      className="mb-8 p-6 md:p-8"
      style={{
        background: colors.background.secondary,
        border: '1px solid rgba(255,136,0,0.15)',
        borderRadius: '0.75rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left: Title + Features */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-txt-primary mb-4">
            {config.title}
          </h3>
          <p className="text-sm text-txt-secondary mb-3">
            Upgrade to <span className="font-semibold text-accent-primary">{config.targetTier}</span> to enable:
          </p>
          <ul className="space-y-2">
            {config.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-txt-secondary">
                <span
                  className="flex-shrink-0 w-1 h-1 rounded-full"
                  style={{ background: colors.signal.warning }}
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: CTA Button */}
        <div className="flex-shrink-0">
          <button
            onClick={handleUpgrade}
            className="px-6 py-3 text-sm font-semibold tracking-[0.15em] uppercase transition-all duration-200"
            style={{
              background: colors.process.primary,
              border: '1px solid ' + colors.process.primary,
              color: '#ffffff',
              borderRadius: '0.5rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            {config.cta}
          </button>
        </div>
      </div>
    </div>
  )
}
