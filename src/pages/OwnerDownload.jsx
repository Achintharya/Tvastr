import { useEffect, useState } from 'react';
import { createOwnerClient, ownerService } from '../lib/ownerIdentity';

export function OwnerDownload() {
  const [auth] = useState(createOwnerClient);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [factor, setFactor] = useState('');
  const [result, setResult] = useState(null);
  const [expiresAt, setExpiresAt] = useState(0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => () => { if (auth) void auth.auth.signOut({ scope: 'local' }).catch(() => {}); }, [auth]);
  useEffect(() => {
    if (!result) return;
    const timer = setTimeout(() => { setResult(null); setError('Download link expired. Sign in again for a new link.'); }, Math.max(0, expiresAt - Date.now()));
    return () => clearTimeout(timer);
  }, [result, expiresAt]);
  async function signIn(e) {
    e.preventDefault(); setBusy(true); setError(''); setResult(null);
    try {
      if (!auth) throw new Error('Owner downloads are not configured.');
      const { error: err } = await auth.auth.signInWithPassword({ email, password });
      setPassword('');
      if (err) throw new Error('Sign-in failed. Check your website credentials.');
      const { data, error: mfaError } = await auth.auth.mfa.listFactors();
      if (mfaError) throw new Error('Could not verify enrolled authenticators.');
      const verified = data.totp.find(f => f.status === 'verified');
      if (!verified) throw new Error('A verified authenticator is required. Owner activation must set up MFA first.');
      setFactor(verified.id);
    } catch (err) {
      setError(err.message); setPassword('');
      if (auth) await auth.auth.signOut({ scope: 'local' }).catch(() => {});
    } finally { setBusy(false); }
  }
  async function requestDownload(e) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const { error: err } = await auth.auth.mfa.challengeAndVerify({ factorId: factor, code });
      setCode('');
      if (err) throw new Error('Authenticator verification failed.');
      const { data: { session } } = await auth.auth.getSession();
      if (!session) throw new Error('Sign in again.');
      const started = Date.now();
      const response = await fetch(ownerService + '/api/owner/download', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + session.access_token },
        body: JSON.stringify({ release_id: 'current', platform: 'win32-x64' }),
        credentials: 'omit', cache: 'no-store', signal: AbortSignal.timeout(10000),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(response.status === 503 ? 'No accepted Windows release is available. Try again after owner activation and release.' : 'Owner download denied. Start a fresh sign-in.');
      const url = new URL(data.download_url);
      if (url.protocol !== 'https:' || url.username || url.password || !Number.isInteger(data.expires_in) || data.expires_in < 1 || data.expires_in > 60 || data.release?.product !== 'TvastrControlPanel' || data.release?.platform !== 'win32-x64' || !/^[a-f0-9]{64}$/.test(data.release?.sha256) || !Number.isSafeInteger(data.release?.size) || data.release.size < 1 || typeof data.release.version !== 'string' || data.release.authenticode_verified !== true || data.release.windows_accepted !== true || typeof data.manifest_b64 !== 'string' || typeof data.signature_b64 !== 'string' || typeof data.certificate_pem !== 'string') throw new Error('Invalid release response.');
      if (started + data.expires_in * 1000 <= Date.now()) throw new Error('Download link expired. Sign in again.');
      setResult(data); setExpiresAt(started + data.expires_in * 1000);
    } catch (err) { setError(err.name === 'TimeoutError' ? 'Download request timed out. Sign in again.' : err.message); }
    finally {
      setCode(''); setFactor('');
      if (auth) await auth.auth.signOut({ scope: 'local' }).catch(() => {});
      setBusy(false);
    }
  }
  function saveVerification(name, content, binary = false) {
    try {
      const bytes = binary ? Uint8Array.from(atob(content), c => c.charCodeAt(0)) : content;
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/octet-stream' }));
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setError('Could not save release verification file. Do not run an unverified archive.'); }
  }
  const input = 'w-full border-b border-current/20 bg-transparent py-3 outline-none focus:border-current';
  return <main className="min-h-screen bg-bg-primary text-txt-primary px-6 pt-32 pb-20">
    <div className="mx-auto max-w-xl">
      <p className="text-xs uppercase tracking-[.2em] text-txt-muted">Tvastr / Owner access</p>
      <h1 className="mt-5 text-4xl leading-tight">Download your<br/><span className="text-txt-muted">local workspace.</span></h1>
      <p className="mt-5 text-sm leading-relaxed text-txt-muted">Private Windows Control Panel release. Fresh website sign-in and authenticator required. This does not grant access to customer business data.</p>
      {!auth && <p role="alert" className="mt-5 text-sm text-red-600">Owner downloads are not configured.</p>}
      {result ? <section className="mt-8 space-y-5">
        <h2 className="text-xl">Control Panel {result.release.version}</h2>
        <p className="text-sm">Windows x64 portable ZIP · {(result.release.size / 1048576).toFixed(1)} MB</p>
        <a className="inline-block py-3 underline underline-offset-4" href={result.download_url} referrerPolicy="no-referrer" rel="noreferrer">Download Windows ZIP →</a>
        <p className="text-sm text-txt-muted">This link works for up to 60 seconds. Anyone holding it can use it during that window. Do not share it. A download already started may continue after the link expires.</p>
        <div className="text-sm"><p>Final ZIP SHA256</p><code className="block mt-2 break-all text-xs">{result.release.sha256}</code></div>
        <div className="flex flex-wrap gap-4 text-sm">
          <button className="underline underline-offset-4" onClick={() => saveVerification('release-manifest.json', result.manifest_b64, true)}>Save signed manifest</button>
          <button className="underline underline-offset-4" onClick={() => saveVerification('release-manifest.sig', result.signature_b64)}>Save signature</button>
          <button className="underline underline-offset-4" onClick={() => saveVerification('publisher.pem', result.certificate_pem)}>Save publisher certificate</button>
        </div>
        <p className="text-sm text-txt-muted">A checksum detects changes; it does not establish the publisher on its own. Follow the release verification runbook and compare the pinned signing certificate before running the panel.</p>
        <button className="underline underline-offset-4" onClick={() => { setResult(null); setEmail(''); }}>Clear download</button>
      </section> : !factor ? <form className="mt-8 space-y-5" onSubmit={signIn}>
        <label className="block text-sm">Website email<input className={input} type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" required/></label>
        <label className="block text-sm">Website password<input className={input} type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required/></label>
        <button className="py-3 underline underline-offset-4 disabled:opacity-50" disabled={busy || !auth}>{busy ? 'Verifying...' : 'Continue to authenticator →'}</button>
      </form> : <form className="mt-8 space-y-5" onSubmit={requestDownload}>
        <label className="block text-sm">Authenticator code<input className={input} inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={e => setCode(e.target.value)} autoComplete="one-time-code" required/></label>
        <button className="py-3 underline underline-offset-4 disabled:opacity-50" disabled={busy}>{busy ? 'Verifying...' : 'Get private download →'}</button>
      </form>}
      {error && <p role="alert" className="mt-5 text-sm text-red-600">{error}</p>}
      <p className="mt-10 text-xs text-txt-muted">Your password is sent only to Supabase. The dedicated owner session is kept in memory and ends after the download request. The existing customer portal session is separate.</p>
    </div>
  </main>;
}
