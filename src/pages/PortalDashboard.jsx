import { Link } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { useLicense } from "../context/license-context";
import { Logo } from "../components/Logo";
import { LockedProductCard } from "../components/LockedProductCard";
import { UpgradeBanner } from "../components/UpgradeBanner";
import { ForgeLoader } from "../components/ForgeLoader";
import { TIER_LABELS, tierToBadgeState } from "../lib/capabilities";
import { CONFIG, openContact } from "../lib/config";
import { legacyColors as colors } from "../design/colors";
import { TierBadge } from "../components/portal/TierBadge";

// Styles extracted to constants for performance - Light Theme
const STYLES = {
  background: { background: colors.background.primary },
  header: {
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
  },
  statusIndicator: {
    background: colors.process.primary,
    boxShadow: "0 0 6px rgba(0,60,51,0.4)",
  },
  titleGradient: {
    background: `linear-gradient(135deg, ${colors.text.primary} 0%, ${colors.text.secondary} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  loadingBox: {
    background: "rgba(255,136,0,0.08)",
    border: "1px solid rgba(255,136,0,0.2)",
    borderRadius: "0.375rem",
    transform: "rotate(45deg)",
    animation: "pulse 1.5s ease-in-out infinite",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  card: {
    background: "#ffffff",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: "0.75rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)",
  },
  cardHoverAccent: {
    background:
      "linear-gradient(to right, transparent, rgba(255,136,0,0.3), transparent)",
  },
  tagVision: {
    color: colors.signal.warning,
    background: "rgba(255,136,0,0.08)",
    border: "1px solid rgba(255,136,0,0.2)",
    borderRadius: "0.375rem",
  },
  supportCard: {
    background: colors.background.secondary,
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: "0.75rem",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  },
  supportButton: {
    color: colors.process.primary,
    border: "1px solid " + colors.process.primary,
    background: "transparent",
    borderRadius: "0.5rem",
  },
};

// Product definitions - Cortex architecture
const PRODUCTS = [
  {
    id: "piras",
    name: "PIRAS",
    description:
      "Your operational intelligence workspace. Real-time quality monitoring, inspection management, process intelligence, and shop floor analytics unified in one system.",
    tag: "Operational Intelligence",
    capability: "ras_enterprise", // Maps to backend capability
    requiredTier: "TIER_1",
  },
  {
    id: "vajra",
    name: "Vajra Cortex",
    description:
      "Executive intelligence layer for strategic decision-making. Natural language querying, semantic memory, and cross-plant analytics for leadership teams.",
    tag: "Executive Intelligence",
    capability: "vajra_enabled", // Maps to backend capability
    requiredTier: "TIER_2",
    upgradeFeatures: [
      "Natural language AI querying",
      "Semantic memory and trend analysis",
      "Executive dashboards and cross-plant intelligence",
    ],
  },
  {
    id: "executive_mis",
    name: "Executive MIS Cortex",
    description:
      "Enterprise-wide manufacturing intelligence. Complete ERP integration, multi-site analytics, and strategic planning capabilities for large organizations.",
    tag: "Enterprise Intelligence",
    capability: "executive_mis", // Future capability
    requiredTier: "TIER_3",
    upgradeFeatures: [
      "Multi-site enterprise analytics",
      "Complete ERP and enterprise system integration",
      "Strategic planning and forecasting",
    ],
  },
];

/**
 * PortalDashboard — Authenticated customer dashboard.
 *
 * Shows Cortex products based on user's license tier:
 *   - TIER_1: PIRAS (active), Vajra (locked), Executive MIS (locked)
 *   - TIER_2: PIRAS (active), Vajra Cortex (active), Executive MIS (locked)
 *   - TIER_3: All three Cortexes active (future)
 *
 * UI is fully tier-driven — no hardcoded logic.
 * Installation and updates are arranged through Tvastr support.
 */
export function PortalDashboard() {
  const { user, signOut } = useAuth();
  const {
    tier,
    customerName,
    capabilities,
    loading: licenseLoading,
    isAdmin,
  } = useLicense();
  return (
    <div className="min-h-screen relative" style={STYLES.background}>
      {/* Top nav */}
      <header className="sticky top-0 z-40" style={STYLES.header}>
        <div className="max-w-7xl mx-auto px-4 md:px-12 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
          >
            <Logo size="sm" />
            <span className="text-txt-muted text-xs hidden md:inline">
              / Customer Portal
            </span>
          </Link>

          <div className="flex items-center gap-3 md:gap-6">
            {isAdmin && (
              <Link
                to="/portal/admin"
                className="text-xs font-semibold tracking-wider md:tracking-widest uppercase transition-colors duration-200 text-txt-muted hover:text-txt-primary"
              >
                <span className="hidden sm:inline">Admin Portal</span>
                <span className="sm:hidden">Admin</span>
              </Link>
            )}
            <Link
              to="/portal/manual"
              className="text-xs font-semibold tracking-wider md:tracking-widest uppercase transition-colors duration-200 text-txt-muted hover:text-txt-primary"
            >
              <span className="hidden sm:inline">User Manual</span>
              <span className="sm:hidden">Manual</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={STYLES.statusIndicator}
              />
              <span className="text-xs text-txt-secondary font-mono">
                {user?.email}
              </span>
            </div>
            <button
              onClick={signOut}
              className="text-xs font-medium tracking-widest uppercase text-txt-muted hover:text-txt-primary transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        {/* Page header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-signal-warning opacity-60" />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-signal-warning opacity-60">
              Customer Portal
            </span>
          </div>
          <h1
            className="text-3xl md:text-4xl font-black tracking-tight mb-3"
            style={STYLES.titleGradient}
          >
            {customerName || "Dashboard"}
          </h1>
          <p className="text-sm text-txt-secondary">
            Welcome back. Your Tvastr Cortexes are listed below.
          </p>
          {tier && (
            <p className="text-xs text-txt-muted mt-2">
              License Tier:{" "}
              <span className="text-txt-secondary font-semibold">
                {TIER_LABELS[tier] || tier}
              </span>
            </p>
          )}
        </div>

        {/* Content */}
        {licenseLoading ? (
          <div className="flex items-center justify-center py-32">
            <ForgeLoader message="Loading systems…" />
          </div>
        ) : (
          <>
            {/* Upgrade Banner */}
            <UpgradeBanner />

            {/* Products and license entitlements */}
            <div className="mb-10">
              {PRODUCTS.map((product, i) => {
                const isActive = capabilities?.[product.capability];
                if (isActive) {
                  // Active product card with license status and installation guidance.
                  // Status badge derives from the canonical tier → badge mapper
                  // (Reqs 15.5, 15.6, 15.7) so the dashboard chip stays aligned
                  // with LockedProductCard / LockedScreen / UpgradeBanner.
                  const badgeState = tierToBadgeState(tier, product.id);

                  return (
                    <div
                      key={product.id}
                      className="group relative flex flex-col transition-all duration-300 mb-6"
                      style={STYLES.card}
                    >
                      {/* Hover top accent */}
                      <div
                        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={STYLES.cardHoverAccent}
                      />

                      <div className="p-5 md:p-8 flex flex-col gap-6">
                        {/* Header row with product info and status */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <span
                              className="text-xs font-semibold tracking-[0.15em] uppercase px-2.5 py-1 inline-block mb-3"
                              style={STYLES.tagVision}
                            >
                              {product.tag}
                            </span>
                            <h3 className="text-2xl font-bold text-txt-primary tracking-tight leading-tight mb-3">
                              {product.name}
                            </h3>
                            <p className="text-sm text-txt-secondary leading-relaxed">
                              {product.description}
                            </p>
                          </div>

                          {/* Status badge — sourced from the canonical
                              tier → badge mapper (Reqs 15.5–15.7). */}
                          <div className="flex-shrink-0">
                            <TierBadge
                              state={badgeState}
                              productId={product.id}
                            />
                          </div>
                        </div>

                        <p className="text-sm text-txt-secondary leading-relaxed" style={STYLES.supportCard}>
                          <span className="block p-5">
                            Installation and updates are handled by Tvastr. Contact support to arrange assistance.
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                } else {
                  // Locked product card
                  const requiredTierLabel =
                    product.requiredTier === "TIER_3" 
                      ? "Complete Platform" 
                      : product.requiredTier === "TIER_2"
                      ? "PIRAS + Vajra"
                      : "PIRAS";
                  return (
                    <div key={product.id} className="mb-6">
                      <LockedProductCard
                        title={product.name}
                        description={product.description}
                        tag={product.tag}
                        index={i}
                        requiredTier={requiredTierLabel}
                        features={product.upgradeFeatures}
                      />
                    </div>
                  );
                }
              })}
            </div>

            {/* Support note */}
            <div
              className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={STYLES.supportCard}
            >
              <div>
                <p className="text-sm font-medium text-txt-secondary mb-1">
                  Need installation support?
                </p>
                <p className="text-xs text-txt-muted">
                  Contact your Tvastr account manager or reach out directly.
                </p>
              </div>
              <button
                onClick={() => {
                  const template = CONFIG.emailTemplates.installationSupport;
                  openContact(
                    CONFIG.emails.installationSupport,
                    template.subject,
                    template.body,
                  );
                }}
                className="flex-shrink-0 px-5 py-2.5 text-xs font-semibold tracking-widest uppercase transition-colors duration-200"
                style={STYLES.supportButton}
              >
                Contact Support
              </button>
            </div>
          </>
        )}

        {/* Back to site */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-xs text-txt-muted hover:text-txt-secondary transition-colors duration-200 tracking-wider"
          >
            ← Return to tvastr.ai
          </Link>
        </div>
      </main>
    </div>
  );
}
