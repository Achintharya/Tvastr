/**
 * Tvastr Design System - Color Tokens
 *
 * Naming conventions:
 * - surface.*  → UI background surfaces (pages, cards, panels)
 * - text.*     → Typography colors
 * - brand.*    → Primary brand/CTA colors (deep green)
 * - accent.*   → Highlight colors (amber accent, danger states)
 * - data.*     → Data visualization, telemetry, icons
 * - border.*   → Border/divider colors
 */

export const colors = {
  // ──────────── SURFACES ────────────
  // Background colors for different UI layers
  surface: {
    base: "#ffffff",      // Main page background
    subtle: "#f1f5ff",    // Alternating/secondary sections
    elevated: "#ffffff",  // Cards, modals, overlays
    panel: "#eeece7",     // Data panels, sidebars
  },

  // ──────────── TEXT ────────────
  // Typography hierarchy
  text: {
    primary: "#212121",   // Headings, body text
    secondary: "#616161", // Descriptions, subtitles
    muted: "#93939f",     // Labels, placeholders, captions
  },

  // ──────────── BRAND ────────────
  // Primary brand colors for CTAs and brand elements
  brand: {
    primary: "#003c33",   // Primary CTA buttons, brand accent (deep green)
  },

  // ──────────── ACCENT ────────────
  // Highlight and status colors
  accent: {
    primary: "#ff8800",   // Section labels, active states, highlights (amber)
    danger: "#b30000",    // Error states, destructive actions
  },

  // ──────────── DATA ────────────
  // Data visualization, telemetry displays
  data: {
    primary: "#1863dc",   // Charts, icons, scrollbar, focus rings (blue)
  },

  // ──────────── BORDERS ────────────
  // Border and divider colors
  border: {
    subtle: "rgba(0, 0, 0, 0.05)",
    default: "rgba(0, 0, 0, 0.1)",
    strong: "rgba(0, 0, 0, 0.15)",
  },
};

// Semantic aliases for specific use cases
export const semantic = {
  brand: "#1863dc",
  alert: "#b45309",
  danger: "#b30000",
};

// ══════════════════════════════════════════════════════════════════════════════
// LEGACY ALIASES - For backward compatibility during migration
// These map old names to new structure. Remove after full migration.
// ══════════════════════════════════════════════════════════════════════════════
export const legacyColors = {
  background: {
    primary: colors.surface.base,
    secondary: colors.surface.subtle,
    elevated: colors.surface.elevated,
    panel: colors.surface.panel,
  },
  text: colors.text,
  telemetry: {
    primary: colors.data.primary,
    secondary: colors.data.primary, // Consolidated
    muted: colors.data.primary,     // Consolidated
  },
  process: {
    primary: colors.brand.primary,
    secondary: colors.brand.primary, // Consolidated
  },
  signal: {
    warning: colors.accent.primary,
    glow: colors.accent.primary,     // Consolidated with warning
    danger: colors.accent.danger,
  },
  border: colors.border,
};
