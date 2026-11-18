import { useEffect, useState } from 'react';
import { createOwnerClient, ownerService } from '../lib/ownerIdentity';

export function OwnerLicenses() {
  const [auth] = useState(() => createOwnerClient('licenses'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [factor, setFactor] = useState('');
  const [factors, setFactors] = useState([]);
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => () => { if (auth) void auth.auth.signOut({ scope: 'local' }).catch(() => {}); }, [auth]);
  useEffect(() => {
    if (!rows) return;
    const timer = setTimeout(() => { setRows(null); setError('License list cleared. Sign in again to reload.'); }, 300000);
    return () => clearTimeout(timer);
  }, [rows]);
  async function signIn(event) {
    event.preventDefault(); setBusy(true); setError(''); setRows(null);
    try {
      if (!auth) throw new Error('Owner access is not configured.');
      const { error } = await auth.auth.signInWithPassword({ email, password });
      setPassword(''); if (error) throw new Error('Sign-in failed.');
      const { data, error: mfaError } = await auth.auth.mfa.listFactors();
      const verifiedFactors = data?.totp?.filter(item => item.status === 'verified') || [];
      const verified = verifiedFactors[0];
      if (mfaError || !verified) throw new Error('An enrolled authenticator and owner activation are required. No password-only fallback.');
      setFactors(verifiedFactors); setFactor(verified.id);
    } catch (err) { setError(err.message); setPassword(''); if (auth) await auth.auth.signOut({ scope: 'local' }).catch(() => {}); }
    finally { setBusy(false); }
  }
  async function load(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const { error } = await auth.auth.mfa.challengeAndVerify({ factorId: factor, code });
      setCode(''); if (error) throw new Error('Authenticator verification failed.');
      const { data: { session } } = await auth.auth.getSession();
      if (!session) throw new Error('Sign in again.');
      const response = await fetch(ownerService + '/api/owner/licenses', { headers: { Authorization: 'Bearer ' + session.access_token }, credentials: 'omit', cache: 'no-store', signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error('Owner license list unavailable or access denied. Check owner enrollment and start a fresh sign-in.');
      const data = await response.json();
      const fields = ['user_id', 'customer_name', 'license_key', 'tier', 'email', 'created_at'];
      if (!Array.isArray(data.licenses) || data.licenses.length > 200 || data.count !== data.licenses.length || data.licenses.some(row => !row || fields.some(key => row[key] !== null && (typeof row[key] !== 'string' || row[key].length > 512)))) throw new Error('Invalid license list response.');
      setRows(data.licenses);
    } catch (err) { setRows(null); setError(err.name === 'TimeoutError' ? 'Request timed out. Sign in again.' : err.message); }
    finally { setCode(''); setFactor(''); if (auth) await auth.auth.signOut({ scope: 'local' }).catch(() => {}); setBusy(false); }
  }
  const input = 'w-full border rounded-lg border-current/20 bg-transparent px-3 py-2 mt-1 text-sm';
  return <section className="p-5 md:p-8 text-txt-primary" aria-label="Secure customer license list">
    <h2 className="text-xl font-semibold">Customer licenses</h2>
    <p className="mt-3 text-sm text-txt-muted max-w-2xl">Read-only owner access. Fresh sign-in and authenticator required. The server verifies your owner identity before reading licenses. Your customer portal session is separate.</p>
    {rows ? <div className="mt-5 space-y-4"><div className="flex flex-wrap gap-4 text-sm"><span>{rows.length} {rows.length === 1 ? 'license' : 'licenses'}</span><button className="underline" onClick={() => setRows(null)}>Clear list</button><span className="text-txt-muted">Clears automatically after five minutes</span></div>{rows.length === 0 ? <p>No licenses found.</p> : <div className="grid gap-3 lg:grid-cols-2">{rows.map((row, index) => <article key={index} className="border border-current/15 rounded-lg p-4 min-w-0 text-sm space-y-2"><h3 className="font-medium">{row.customer_name || 'Unnamed customer'}</h3><p className="break-all">{row.email || 'No linked email'}</p><p className="break-all font-mono text-xs">{row.license_key}</p><p>{row.tier || 'No tier'} · {row.created_at ? new Date(row.created_at).toLocaleDateString('en-IN') : 'No creation date'}</p></article>)}</div>}</div> : !factor ? <form className="mt-6 max-w-md space-y-4" onSubmit={signIn}><label className="block text-sm">Owner website email<input className={input} type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="username" required /></label><label className="block text-sm">Owner website password<input className={input} type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required /></label><button className="underline disabled:opacity-50" disabled={busy || !auth}>{busy ? 'Verifying...' : 'Continue to authenticator'}</button></form> : <form className="mt-6 max-w-md space-y-4" onSubmit={load}>{factors.length > 1 && <label className="block text-sm">Use authenticator<select className={input} value={factor} onChange={event => setFactor(event.target.value)}>{factors.map(item => <option key={item.id} value={item.id}>{item.friendly_name || 'Authenticator'}</option>)}</select></label>}<label className="block text-sm">Authenticator code<input className={input} inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={event => setCode(event.target.value)} autoComplete="one-time-code" required /></label><button className="underline disabled:opacity-50" disabled={busy}>{busy ? 'Loading...' : 'Load customer licenses'}</button></form>}
    {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
  </section>;
}
