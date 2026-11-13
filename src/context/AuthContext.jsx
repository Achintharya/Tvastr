import { useEffect, useState, useCallback, useMemo } from 'react'
import { AuthContext } from './auth-context'
import { supabase } from '../lib/supabaseClient'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load existing session from localStorage on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Subscribe to auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  /**
   * Sign in with email and password.
   * @returns {{ error: Error|null }}
   */
  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }, [])

  /**
   * Sign out and clear session.
   */
  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setSession(null)
  }, [])

  /**
   * Request password reset email.
   * @param {string} email - User email address
   * @returns {{ error: Error|null }}
   */
  const resetPassword = useCallback(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/portal/reset-password`,
    })
    return { error }
  }, [])

  /**
   * Update user password (must be called when user is logged in or has valid reset token).
   * @param {string} newPassword - New password
   * @returns {{ error: Error|null }}
   */
  const updatePassword = useCallback(async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    return { error }
  }, [])

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signIn,
      signOut,
      resetPassword,
      updatePassword,
    }),
    [session, loading, signIn, signOut, resetPassword, updatePassword]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
