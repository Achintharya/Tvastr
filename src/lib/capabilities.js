/**
 * Tier-based capability system for Tvastr customer portal.
 *
 * PIRASCortex + Vajra Architecture (Phase 21A):
 *   - TIER_1 (PIRASCortex)       — Full industrial runtime (NOT a crippled tier)
 *   - TIER_2 (PIRASCortex+Vajra) — Adds Vajra cognitive layer
 *   - TIER_3                     — Reserved for future industrial cognition expansion
 *
 * All UI and routing logic should derive from getCapabilities(tier).
 */

/**
 * Tier constants
 */
export const TIERS = {
  TIER_1: "TIER_1", // PIRASCortex - Full industrial runtime
  TIER_2: "TIER_2", // PIRASCortex + Vajra cognitive layer
  TIER_3: "TIER_3", // Reserved for future expansion
};

/**
 * Tier hierarchy map (lower number = lower tier)
 */
export const TIER_ORDER = {
  TIER_1: 1,
  TIER_2: 2,
  TIER_3: 3,
  // Legacy aliases (used in old database seed data)
  ras_core: 1,
  ras_enterprise: 2,
  full_stack: 3,
};

/**
 * Display labels for tiers (used in UI) - Customer-facing names
 */
export const TIER_LABELS = {
  TIER_1: "Operational Intelligence",
  TIER_2: "Complete Intelligence Platform",
  TIER_3: "Enterprise Platform",
};

/**
 * normalizeTierName — Converts legacy tier names to new format
 * @param {string} tier — Tier name (legacy or new format)
 * @returns {string} — Normalized tier name
 */
function normalizeTierName(tier) {
  const legacyMapping = {
    ras_core: TIERS.TIER_1,
    ras_enterprise: TIERS.TIER_2,
    full_stack: TIERS.TIER_3,
  };

  return legacyMapping[tier] || tier;
}

/**
 * Convert a tier string into a capabilities object.
 * This is the single source of truth for what each tier can access.
 *
 * Phase 21A: TIER_1 (PIRASCortex) = full industrial runtime
 *   - All products available to all tiers
 *   - TIER_2 adds Vajra cognitive layer (not represented here)
 *
 * @param {string} tier - User's license tier
 * @returns {Object} Capability flags
 */
export function getCapabilities(tier) {
  const normalized = normalizeTierName(tier);

  // Phase 21A: All PIRASCortex capabilities available to all tiers
  return {
    ras_core: true,           // All tiers
    ras_enterprise: true,     // All tiers (Phase 21A)
    plant_intelligence: true, // All tiers (Phase 21A: PI is part of PIRASCortex)
    vajra_enabled: normalized === TIERS.TIER_2 || normalized === TIERS.TIER_3,
  };
}

/**
 * Check if a version is allowed for a given tier.
 * Used to filter downloads based on required_tier.
 *
 * @param {Object} version - Version object with required_tier field
 * @param {string} tier - User's license tier
 * @returns {boolean} True if user can access this version
 */
export function isAllowed(version, tier) {
  if (!version?.required_tier) return false;
  const normalizedTier = normalizeTierName(tier);
  const normalizedRequired = normalizeTierName(version.required_tier);
  return TIER_ORDER[normalizedTier] >= TIER_ORDER[normalizedRequired];
}

/**
 * Get the display label for a version based on its required_tier.
 *
 * @param {Object} version - Version object with required_tier field
 * @returns {string} Human-readable label
 */
export function getVersionLabel(version) {
  const normalized = normalizeTierName(version.required_tier);
  return TIER_LABELS[normalized] || "Unknown";
}

/**
 * tierToBadgeState — Pure mapper from (tier, productId) to a Tier_Badge state.
 *
 * Phase 21A (PIRASCortex + Vajra Architecture):
 *   All PIRASCortex products are ACTIVE for all recognized tiers.
 *   TIER_2+ adds Vajra cognitive layer (vajra_enabled).
 *
 * | Tier                       | ras_core | ras_enterprise | plant_intelligence | vajra    |
 * | -------------------------- | -------- | -------------- | ------------------ | -------- |
 * | TIER_1 (PIRASCortex)       | ACTIVE   | ACTIVE         | ACTIVE             | LOCKED   |
 * | TIER_2 (PIRASCortex+Vajra) | ACTIVE   | ACTIVE         | ACTIVE             | ACTIVE   |
 * | TIER_3 (Reserved)          | ACTIVE   | ACTIVE         | ACTIVE             | ACTIVE   |
 * | unrecognized / undefined   | LOCKED   | LOCKED         | LOCKED             | LOCKED   |
 *
 * Implementation invariants:
 *   - Normalizes legacy tier aliases (ras_core, ras_enterprise, full_stack)
 *     via the existing `normalizeTierName` helper.
 *   - Unrecognized or undefined tiers always return 'LOCKED'.
 *   - Unknown productIds always return 'LOCKED'.
 *
 * @param {string} tier — License tier (TIER_1/2/3 or legacy alias).
 * @param {string} productId — One of 'ras_core', 'ras_enterprise', 'plant_intelligence', 'vajra'.
 * @returns {'ACTIVE'|'INCLUDED'|'LOCKED'} Badge state for the given pair.
 */
export function tierToBadgeState(tier, productId) {
  const normalizedTier = normalizeTierName(tier);

  // Unrecognized / undefined tier => LOCKED for every product
  if (
    normalizedTier !== TIERS.TIER_1 &&
    normalizedTier !== TIERS.TIER_2 &&
    normalizedTier !== TIERS.TIER_3
  ) {
    return "LOCKED";
  }

  switch (productId) {
    case "ras_core":
    case "ras_enterprise":
    case "plant_intelligence":
    case "piras":
      // PIRAS (operational intelligence) is ACTIVE for all recognized tiers
      return "ACTIVE";

    case "vajra":
      // Vajra Cortex (executive intelligence) is TIER_2+ only
      if (normalizedTier === TIERS.TIER_2 || normalizedTier === TIERS.TIER_3) {
        return "ACTIVE";
      }
      return "LOCKED";

    case "executive_mis":
      // Executive MIS Cortex is TIER_3+ only
      if (normalizedTier === TIERS.TIER_3) {
        return "ACTIVE";
      }
      return "LOCKED";

    default:
      // Unknown product => LOCKED.
      return "LOCKED";
  }
}
