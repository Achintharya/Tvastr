import { useEffect, useRef, useState } from 'react';
import { createOwnerClient } from '../lib/ownerIdentity';

// Self-service account security only. Enrollment does not grant inventory access.
export function OwnerAuthenticator({ expectedUser }) {
  const [auth] = useState(() => createOwnerClient('authenticator'));
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState('password');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('Microsoft Authenticator');
  const [factors, setFactors] = useState([]);
  const [factor, setFactor] = useState('');
  const [setup, setSetup] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const active = useRef(true);
  const generation = useRef(0);
  const deadline = useRef(null);
  const input = 'w-full border rounded-lg border-current/20 bg-transparent px-3 py-2 mt-1 text-sm';

  async function close(message = '') {
    generation.current += 1;
    clearTimeout(deadline.current);
    if (active.current) {
      setSetup(null); setPassword(''); setCode(''); setFactors([]); setFactor('');
      setStage('password'); setNotice(message); setError(''); setBusy(false);
    }
    if (auth) await auth.auth.signOut({ scope: 'local' }).catch(() => {});
  }
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false; generation.current += 1; clearTimeout(deadline.current);
      // Never unenroll automatically: verification may have completed in flight.
      if (auth) void auth.auth.signOut({ scope: 'local' }).catch(() => {});
    };
  }, [auth]);

  async function signIn(event) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    try {
      if (!auth || !expectedUser?.id || !expectedUser?.email) throw new Error('Sign into your website account first.');
      const result = await auth.auth.signInWithPassword({ email: expectedUser.email, password });
      setPassword('');
      if (result.error) throw new Error('Password verification failed.');
      const { data, error: userError } = await auth.auth.getUser();
      if (userError || data?.user?.id !== expectedUser.id) throw new Error('Account verification failed.');
      const { data: list, error: listError } = await auth.auth.mfa.listFactors();
      if (listError) throw new Error('Could not check existing authenticators.');
      const verified = list?.totp?.filter(item => item.status === 'verified') || [];
      setFactors(verified); setFactor(verified[0]?.id || ''); setStage(verified.length ? 'existing' : 'ready');
      deadline.current = setTimeout(() => { void close('Security session expired. Verify your password again.'); }, 300000);
    } catch (err) {
      setError(err.message); setPassword('');
      if (auth) await auth.auth.signOut({ scope: 'local' }).catch(() => {});
    } finally { if (active.current) setBusy(false); }
  }
  async function verifyExisting(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const { error } = await auth.auth.mfa.challengeAndVerify({ factorId: factor, code });
      setCode(''); if (error) throw new Error('Current authenticator code was not accepted.');
      setStage('ready');
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  async function enroll() {
    const version = generation.current;
    setBusy(true); setError(''); setNotice('');
    try {
      const label = name.trim();
      if (!label || label.length > 64) throw new Error('Use an authenticator name of 1 to 64 characters.');
      const { data, error } = await auth.auth.mfa.enroll({ factorType: 'totp', friendlyName: label, issuer: 'Tvastr' });
      if (error || !data?.id || !data?.totp?.qr_code || !data?.totp?.secret) throw new Error('Could not start authenticator setup. Existing authenticators are unchanged. Try a different name if one already exists.');
      if (!active.current || version !== generation.current) return;
      const qr = data.totp.qr_code.startsWith('data:image/svg+xml') ? data.totp.qr_code : 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(data.totp.qr_code);
      setSetup({ id: data.id, qr, secret: data.totp.secret }); setStage('scan');
    } catch (err) { setError(err.message); }
    finally { if (active.current) setBusy(false); }
  }
  async function confirm(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const { error } = await auth.auth.mfa.challengeAndVerify({ factorId: setup.id, code });
      setCode(''); if (error) throw new Error('Code not accepted. Check the Tvastr entry and use its current code.');
      const { data, error: listError } = await auth.auth.mfa.listFactors();
      if (listError || !data?.totp?.some(item => item.id === setup.id && item.status === 'verified')) {
        setSetup(null); await close('Code accepted, but activation could not be rechecked. Sign in to check your authenticators before trying again.'); return;
      }
      await close('Authenticator verified. Use its code with your password in Customer licenses above. Your existing authenticators are unchanged.');
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return <section className="p-5 md:p-8 border-t border-current/10 text-txt-primary" aria-label="Authenticator settings">
    <h2 className="text-lg font-semibold">Authenticator settings</h2>
    <p className="mt-2 text-sm text-txt-muted max-w-2xl">Set up Microsoft Authenticator or add a backup app. Existing authenticators are never replaced or removed here. This does not enable signing, downloads or maintenance.</p>
    {!open ? <button className="mt-4 underline text-sm" onClick={() => setOpen(true)}>Set up or check authenticators</button> : <div className="mt-5 max-w-lg space-y-4 text-sm">
      <p className="break-all">Website account: <strong>{expectedUser?.email || 'Not signed in'}</strong></p>
      {stage === 'password' && <form className="space-y-4" onSubmit={signIn}><label className="block">Website password for authenticator settings<input className={input} type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required /></label><button className="underline" disabled={busy || !auth}>{busy ? 'Checking...' : 'Verify password'}</button></form>}
      {stage !== 'password' && <><p>{factors.length ? `${factors.length} verified authenticator${factors.length === 1 ? '' : 's'}` : 'No verified authenticator yet.'}</p>{factors.length > 0 && <ul className="list-disc pl-5">{factors.map(item => <li key={item.id} className="break-words">{item.friendly_name || 'Authenticator'} <span className="text-txt-muted">(verified)</span></li>)}</ul>}</>}
      {stage === 'existing' && <form className="space-y-4" onSubmit={verifyExisting}><p>Verify an existing authenticator before adding a backup.</p><label className="block">Existing authenticator<select className={input} value={factor} onChange={e => setFactor(e.target.value)}>{factors.map(item => <option key={item.id} value={item.id}>{item.friendly_name || 'Authenticator'}</option>)}</select></label><label className="block">Current authenticator code<input className={input} inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="one-time-code" value={code} onChange={e => setCode(e.target.value)} required /></label><button className="underline" disabled={busy}>Verify current authenticator</button></form>}
      {stage === 'ready' && <div className="space-y-4"><label className="block">New authenticator name<input className={input} value={name} maxLength={64} onChange={e => setName(e.target.value)} /></label><p>On another screen, open Microsoft Authenticator, tap +, then Other account. Keep a working backup authenticator if possible. This page does not issue recovery codes.</p><button className="underline" disabled={busy} onClick={enroll}>{busy ? 'Preparing...' : 'Show setup QR'}</button></div>}
      {stage === 'scan' && setup && <form className="space-y-4" onSubmit={confirm}><p>Scan this QR in Microsoft Authenticator on your phone. Keep it private. Do not send the QR or setup key in chat.</p><div className="p-3 bg-white rounded-lg w-fit max-w-full"><img src={setup.qr} alt="Private authenticator setup QR" className="w-56 h-56 max-w-full" /></div><details><summary className="cursor-pointer underline">Can't scan? Enter the setup key manually</summary><p className="mt-2 break-all font-mono select-all">{setup.secret}</p><p className="mt-2">Use a time-based code. Keep this key private.</p></details><label className="block">New app's current code<input className={input} inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="one-time-code" value={code} onChange={e => setCode(e.target.value)} required /></label><button className="underline" disabled={busy}>{busy ? 'Verifying...' : 'Confirm authenticator'}</button></form>}
      <button className="underline text-txt-muted" disabled={busy} onClick={async () => { await close(); setOpen(false); }}>Close security settings</button>
      <p className="text-xs text-txt-muted">Security sessions and setup keys clear after five minutes. If setup expires before confirmation, start again. Your normal customer portal session stays separate.</p>
    </div>}
    {notice && <p role="status" className="mt-4 text-sm">{notice}</p>}{error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
  </section>;
}
