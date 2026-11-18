import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AdminAccessContext } from './admin-access-context';
import { createOwnerClient, ownerService } from '../lib/ownerIdentity';

const FIELDS = ['user_id', 'customer_name', 'license_key', 'tier', 'email', 'created_at'];
const FRESH_WINDOW = 300000;

// Admin sign-in never passes through the persistent customer Supabase client.
// The server, not the email hint or customer license, decides owner authorization.
export function AdminAccessProvider({ children }) {
  const auth = useRef(null);
  const [access, setAccess] = useState(null);
  const [factors, setFactors] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const sequence = useRef(0);
  const timer = useRef(null);
  const controller = useRef(null);
  const passwordAt = useRef(0);
  const pendingUser = useRef(null);

  const signOutLocal = useCallback(async (client) => {
    if (client) await client.auth.signOut({ scope: 'local' }).catch(() => {});
  }, []);
  const clear = useCallback((message = '') => {
    sequence.current += 1;
    clearTimeout(timer.current); controller.current?.abort(); controller.current = null;
    passwordAt.current = 0; pendingUser.current = null;
    setAccess(null); setFactors([]); setBusy(false); setError(message);
    const previous = auth.current; auth.current = null;
    void signOutLocal(previous);
  }, [signOutLocal]);
  useEffect(() => () => {
    sequence.current += 1; clearTimeout(timer.current); controller.current?.abort();
    const previous = auth.current; auth.current = null;
    void signOutLocal(previous);
  }, [signOutLocal]);

  const start = useCallback(async (email, password) => {
    const run = ++sequence.current;
    const previous = auth.current;
    const client = createOwnerClient('admin-login');
    auth.current = client;
    void signOutLocal(previous);
    clearTimeout(timer.current); controller.current?.abort();
    setAccess(null); setFactors([]); setError(''); setBusy(true); pendingUser.current = null;
    try {
      if (!client) throw new Error('Admin access is not configured.');
      const result = await client.auth.signInWithPassword({ email, password });
      if (run !== sequence.current) return false;
      if (result.error) throw new Error('Invalid email or password.');
      const { data: identity, error: userError } = await client.auth.getUser();
      if (run !== sequence.current) return false;
      if (userError || !identity?.user?.id) throw new Error('Could not verify the signed-in account.');
      const { data, error: factorError } = await client.auth.mfa.listFactors();
      if (run !== sequence.current) return false;
      const verified = data?.totp?.filter(item => item.status === 'verified') || [];
      if (factorError || !verified.length) throw new Error('No verified authenticator found. Contact support for secure account setup.');
      pendingUser.current = { id: identity.user.id, email: identity.user.email };
      passwordAt.current = Date.now(); setFactors(verified);
      timer.current = setTimeout(() => clear('Admin sign-in expired. Enter your password again.'), FRESH_WINDOW);
      return true;
    } catch (err) {
      if (run === sequence.current) { setError(err.message); await signOutLocal(client); }
      return false;
    } finally {
      if (run === sequence.current) setBusy(false);
      else void signOutLocal(client);
    }
  }, [clear, signOutLocal]);

  const verify = useCallback(async (factorId, code) => {
    const run = sequence.current;
    const client = auth.current;
    setBusy(true); setError('');
    try {
      if (!client || !pendingUser.current || !factors.some(item => item.id === factorId) || Date.now() - passwordAt.current >= FRESH_WINDOW) throw new Error('Admin sign-in expired. Enter your password again.');
      const { error: factorError } = await client.auth.mfa.challengeAndVerify({ factorId, code });
      if (run !== sequence.current) return false;
      if (factorError) throw new Error('Authenticator verification failed. Sign in again with a current code.');
      const { data: { session } } = await client.auth.getSession();
      if (run !== sequence.current) return false;
      if (!session) throw new Error('Admin session expired. Sign in again.');
      controller.current = new AbortController();
      const signal = AbortSignal.any([controller.current.signal, AbortSignal.timeout(75000)]);
      const response = await fetch(ownerService + '/api/owner/licenses', { headers: { Authorization: 'Bearer ' + session.access_token }, credentials: 'omit', cache: 'no-store', signal });
      if (run !== sequence.current) return false;
      if (!response.ok) throw new Error('Admin access denied or customer list unavailable. Start a fresh sign-in.');
      const data = await response.json();
      if (run !== sequence.current) return false;
      if (!Array.isArray(data.licenses) || data.licenses.length > 200 || data.count !== data.licenses.length || data.licenses.some(row => !row || FIELDS.some(key => row[key] !== null && (typeof row[key] !== 'string' || row[key].length > 512)))) throw new Error('Invalid license list response.');
      const user = pendingUser.current;
      pendingUser.current = null; passwordAt.current = 0; clearTimeout(timer.current);
      setFactors([]); setAccess({ user, rows: data.licenses });
      timer.current = setTimeout(() => clear('Admin access expired. Sign in again.'), FRESH_WINDOW);
      return true;
    } catch (err) {
      if (run === sequence.current) clear(err.name === 'TimeoutError' ? 'Server timed out. Sign in again.' : err.message);
      return false;
    } finally {
      await signOutLocal(client);
      if (auth.current === client) auth.current = null;
      if (run === sequence.current) setBusy(false);
    }
  }, [factors, clear, signOutLocal]);

  const value = useMemo(() => ({ access, factors, busy, error, start, verify, clear }), [access, factors, busy, error, start, verify, clear]);
  return <AdminAccessContext.Provider value={value}>{children}</AdminAccessContext.Provider>;
}
