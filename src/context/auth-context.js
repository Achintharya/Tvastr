import { createContext, useContext } from 'react'

/**
 * AuthContext — Provides authentication state and actions throughout the app.
 * Kept in a component-free module so the provider file exports only
 * components and React Fast Refresh can do a full-page-state-preserving
 * reload.
 *
 * Exposes:
 *   session        — Supabase session object (null when logged out)
 *   user           — Supabase user object (null when logged out)
 *   loading        — true while initial session is being fetched
 *   signIn         — async (email, password) → { error }
 *   signOut        — async () => void
 *   resetPassword  — async (email) → { error }
 *   updatePassword — async (newPassword) => { error }
 */
export const AuthContext = createContext(null)

/**
 * useAuth — Convenience hook for consuming AuthContext.
 * Must be used inside <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
