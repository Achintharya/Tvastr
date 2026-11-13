import { useEffect, useState, useMemo } from 'react'
import { useAuth } from './auth-context'
import { LicenseContext } from './license-context'
import { supabase } from '../lib/supabaseClient'
import { getCapabilities } from '../lib/capabilities'
import { isAdmin as checkIsAdmin } from '../lib/admin'

export function LicenseProvider({ children }) {
  const { user } = useAuth()
  const [tier, setTier] = useState(null)
  const [customerName, setCustomerName] = useState(null)
  const [licenseKey, setLicenseKey] = useState(null)
  const [loading, setLoading] = useState(() => !!user)
  const [error, setError] = useState(null)

  // Reset license state when the user logs out. Adjusting state during
  // render (the documented alternative to a synchronously-set-state effect)
  // avoids a cascading render on every auth change.
  const [prevUser, setPrevUser] = useState(user)
  if (prevUser !== user) {
    setPrevUser(user)
    if (!user) {
      // Not logged in → reset
      setTier(null)
      setLoading(false)
      setError(null)
    }
  }

  useEffect(() => {
    if (!user) {
      // Not logged in → nothing to fetch; state was reset during render.
      return
    }

    // Fetch user's license tier from Supabase
    async function fetchLicense() {
      setLoading(true)
      setError(null)

      try {
        const { data, error: fetchError } = await supabase
          .from('licenses')
          .select('tier, customer_name, license_key')
          .eq('user_id', user.id)
          .single()

        if (fetchError) {
          // If no license found, treat as error
          if (fetchError.code === 'PGRST116') {
            throw new Error('No license found for your account. Contact support.')
          }
          throw fetchError
        }

        setTier(data.tier)
        setCustomerName(data.customer_name)
        setLicenseKey(data.license_key)
      } catch (err) {
        console.error('[LicenseContext] Failed to fetch license:', err)
        setError(err.message || 'Failed to load license information.')
        setTier(null)
      } finally {
        setLoading(false)
      }
    }

    fetchLicense()
  }, [user])

  const capabilities = tier ? getCapabilities(tier) : null
  
  // Check if current user is admin
  const isAdmin = useMemo(
    () => checkIsAdmin(user, licenseKey),
    [user, licenseKey]
  )

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({ tier, customerName, licenseKey, capabilities, isAdmin, loading, error }),
    [tier, customerName, licenseKey, capabilities, isAdmin, loading, error]
  )

  return (
    <LicenseContext.Provider value={value}>
      {children}
    </LicenseContext.Provider>
  )
}
