import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AdminAccessContext } from './admin-access-context';
import { createOwnerClient, ownerService } from '../lib/ownerIdentity';
import { ADMIN_IDENTIFIERS } from '../lib/admin';
const FIELDS = ['user_id', 'customer_name', 'license_key', 'tier', 'email', 'created_at'];
const WINDOW = 300000;

// Password opens only the shell. Every private request is authorized by server UUID policy.
// Neither password nor bearer tokens are persisted by this provider.
export function AdminAccessProvider({ children }) {
  const auth = useRef(null), generation = useRef(0), timer = useRef(null), controller = useRef(null);
  const [portal, setPortal] = useState(null), [access, setAccess] = useState(null);
  const [factors, setFactors] = useState([]), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const signOutLocal = useCallback(async c => { if (c) await c.auth.signOut({ scope: 'local' }).catch(() => {}); }, []);
  const lock = useCallback((message = '') => {
    generation.current++; clearTimeout(timer.current); controller.current?.abort(); controller.current = null;
    setAccess(null); setBusy(false); setError(message);
  }, []);
  const clear = useCallback((message = '') => {
    lock(message); setPortal(null); setFactors([]); const c = auth.current; auth.current = null; void signOutLocal(c);
  }, [lock, signOutLocal]);
  useEffect(() => () => {
    generation.current++; clearTimeout(timer.current); controller.current?.abort(); void signOutLocal(auth.current); auth.current = null;
  }, [signOutLocal]);
  const start = useCallback(async (email, password) => {
    clear(); const run = ++generation.current; const c = createOwnerClient('admin-login'); auth.current = c; setBusy(true);
    try {
      if (!c) throw new Error('Portal access is not configured.');
      const result = await c.auth.signInWithPassword({ email, password });
      if (result.error) throw new Error('Invalid email or password.');
      const { data, error: e } = await c.auth.getUser();
      if (e || !data?.user?.id || data.user.email?.toLowerCase() !== ADMIN_IDENTIFIERS.email.toLowerCase()) throw new Error('Could not verify the signed-in owner account.');
      if (run !== generation.current) return false;
      setPortal({ user: { id: data.user.id, email: data.user.email } }); return true;
    } catch (e) { if (run === generation.current) { setError(e.message); void signOutLocal(c); auth.current = null; } return false; }
    finally { if (run === generation.current) setBusy(false); }
  }, [clear, signOutLocal]);
  const prepare = useCallback(async () => {
    if (!auth.current || !portal) return false;
    const run = generation.current; setBusy(true); setError('');
    try {
      const { data, error: e } = await auth.current.auth.mfa.listFactors();
      if (run !== generation.current) return false;
      const verified = data?.totp?.filter(f => f.status === 'verified') || [];
      if (e || !verified.length) throw new Error('No verified authenticator found. Open Security settings for secure account setup.');
      setFactors(verified); return true;
    } catch (e) { if (run === generation.current) setError(e.message); return false; }
    finally { if (run === generation.current) setBusy(false); }
  }, [portal]);
  const request = useCallback(async (path, options = {}) => {
    const c = auth.current; if (!c || !portal) throw new Error('Sign into the portal again.');
    const { data: { session } } = await c.auth.getSession();
    if (!session) { clear('Portal session expired. Sign in again.'); throw new Error('Portal session expired. Sign in again.'); }
    return fetch(ownerService + path, { ...options, headers: { ...options.headers, Authorization: 'Bearer ' + session.access_token }, credentials: 'omit', cache: 'no-store' });
  }, [portal, clear]);
  const verify = useCallback(async (factorId, code) => {
    if (!auth.current || !portal || !factors.some(f => f.id === factorId)) return false;
    const run = ++generation.current; clearTimeout(timer.current); controller.current?.abort(); controller.current = new AbortController();
    const began = Date.now(); setAccess(null); setBusy(true); setError('');
    // Expiry starts with the challenge, not after a slow server response.
    timer.current = setTimeout(() => lock('Customer access expired. Enter a new authenticator code.'), WINDOW);
    try {
      const { error: e } = await auth.current.auth.mfa.challengeAndVerify({ factorId, code });
      if (run !== generation.current) return false;
      if (e) throw new Error('Authenticator verification failed. Try a current code.');
      const response = await request('/api/owner/licenses', { signal: AbortSignal.any([controller.current.signal, AbortSignal.timeout(75000)]) });
      if (run !== generation.current) return false;
      if (!response.ok) throw new Error('Customer list unavailable. Check the code or retry when the server is ready.');
      const data = await response.json();
      if (run !== generation.current || Date.now() - began >= WINDOW) return false;
      if (!Array.isArray(data.licenses) || data.licenses.length > 200 || data.count !== data.licenses.length || data.licenses.some(row => !row || FIELDS.some(k => row[k] !== null && (typeof row[k] !== 'string' || row[k].length > 512)))) throw new Error('Invalid license list response.');
      setAccess({ user: portal.user, rows: data.licenses }); return true;
    } catch (e) { if (run === generation.current) lock(e.name === 'TimeoutError' ? 'Customer server timed out. Resources and Docs remain available.' : e.message); return false; }
    finally { if (run === generation.current) setBusy(false); }
  }, [portal, factors, request, lock]);
  const value = useMemo(() => ({ portal, access, factors, busy, error, start, prepare, verify, lock, clear, request }), [portal, access, factors, busy, error, start, prepare, verify, lock, clear, request]);
  return <AdminAccessContext.Provider value={value}>{children}</AdminAccessContext.Provider>;
}
