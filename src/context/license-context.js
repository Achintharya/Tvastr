import { createContext, useContext } from 'react'

/**
 * LicenseContext — Provides license tier and capability information.
 * Kept in a component-free module so the provider file exports only
 * components and React Fast Refresh can do a full-page-state-preserving
 * reload.
 *
 * Exposes:
 *   tier          — User's license tier ('TIER_1', 'TIER_2', 'TIER_3', or null)
 *   customerName  — Customer organization name
 *   licenseKey    — User's license key (for update server API calls)
 *   capabilities  — Capability flags derived from tier
 *   isAdmin       — True if user is admin (achintharya@gmail.com or TVASTR-ACHINTH license)
 *   loading       — True while fetching license data
 *   error         — Error message if license fetch fails
 */
export const LicenseContext = createContext(null)

/**
 * useLicense — Convenience hook for consuming LicenseContext.
 * Must be used inside <LicenseProvider>.
 */
export function useLicense() {
  const ctx = useContext(LicenseContext)
  if (!ctx) throw new Error('useLicense must be used within LicenseProvider')
  return ctx
}
