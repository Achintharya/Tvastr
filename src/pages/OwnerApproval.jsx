import { useEffect, useMemo, useState } from 'react';
import { createOwnerClient, ownerConfigured as configured, ownerService as service } from '../lib/ownerIdentity';

function maintenanceSummary(encoded) {
  try {
    const decode=value=>JSON.parse(atob(value.replace(/-/g,'+').replace(/_/g,'/')));
    const data=decode(decode(encoded.trim()).payload);
    if(data.purpose!=='tvastr-maintenance-challenge-v1'||data.product!=='piras'||!/^[-a-f0-9]{36}$/.test(data.installation)) throw new Error();
    return `PIRAS installation: ${data.installation}. Compare this ID with the selected local product. Display Names only.`;
  } catch { return 'Paste a valid product maintenance challenge. This summary is informational; the service verifies it before approval.'; }
}

export function OwnerApproval() {
  // Per-mount, memory-only identity client. Never reuse or broadcast to the
  // normal customer portal session. Unmount ends this isolated sign-in.
  const auth = useMemo(() => createOwnerClient('approval'), []);
  useEffect(() => () => { if(auth) void auth.auth.signOut({scope:'local'}).catch(()=>{}); }, [auth]);
  const [purpose,setPurpose]=useState('panel');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [challenge,setChallenge]=useState('');
  const [code,setCode]=useState('');
  const [factor,setFactor]=useState('');
  const [approval,setApproval]=useState('');
  const [instance,setInstance]=useState('');
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const [expiresAt,setExpiresAt]=useState(0);
  useEffect(() => {
    if(!approval || !expiresAt) return;
    const timer=setTimeout(()=>{setApproval('');setInstance('');setExpiresAt(0);setError('Approval expired. Start a fresh sign-in.');},Math.max(0,expiresAt*1000-Date.now()));
    return ()=>clearTimeout(timer);
  },[approval,expiresAt]);
  async function signIn(e) {
    e.preventDefault();setBusy(true);setError('');setApproval('');setFactor('');setCode('');
    try {
      if (!auth) throw new Error('Owner approval service is not configured.');
      const {error:err}=await auth.auth.signInWithPassword({email,password});
      setPassword('');if(err) throw new Error('Sign-in failed. Check your website credentials.');
      const {data,error:factorError}=await auth.auth.mfa.listFactors();
      if(factorError) throw new Error('Could not verify enrolled authenticators.');
      const verified=data.totp.find(f=>f.status==='verified');
      if(!verified) throw new Error('No verified authenticator is enrolled. Owner activation must set up MFA before this panel can be approved. There is no password-only fallback.');
      setFactor(verified.id);
    } catch(err) {setError(err.message);setPassword('');if(auth) await auth.auth.signOut({scope:'local'}).catch(()=>{});}
    finally{setBusy(false);}
  }
  async function approve(e) {
    e.preventDefault();setBusy(true);setError('');
    try {
      if(!auth) throw new Error('Owner approval service is not configured.');
      const {error:err}=await auth.auth.mfa.challengeAndVerify({factorId:factor,code});
      setCode('');if(err) throw new Error('Authenticator verification failed.');
      const {data:{session}}=await auth.auth.getSession();
      if(!session) throw new Error('Sign in again.');
      const response=await fetch(service+(purpose==='maintenance'?'/api/owner/maintenance/approve':'/api/owner/approve'),{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+session.access_token},body:JSON.stringify({challenge:challenge.trim()}),credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(10000)});
      const data=await response.json();
      if(!response.ok) throw new Error('Owner approval denied. Start a fresh sign-in.');
      if(typeof data.approval!=='string' || typeof data.instance!=='string' || !Number.isInteger(data.expires_at) || data.expires_at*1000<=Date.now() || data.expires_at*1000>Date.now()+900000) throw new Error('Invalid approval response.');
      setApproval(data.approval);setInstance(data.instance);setExpiresAt(data.expires_at);setChallenge('');setFactor('');
      // End this dedicated Auth session, never the separate normal portal session.
    } catch(err) {setError(err.name==='TimeoutError'?'Approval timed out. Start a fresh local challenge and try again.':err.message);}
    finally{setCode('');setFactor('');if(auth) await auth.auth.signOut({scope:'local'}).catch(()=>{});setBusy(false);}
  }
  const input='w-full border-b border-current/20 bg-transparent py-3 outline-none focus:border-current';
  return <main className="min-h-screen bg-bg-primary text-txt-primary px-6 pt-32 pb-20">
    <div className="mx-auto max-w-xl">
      <p className="text-xs uppercase tracking-[.2em] text-txt-muted">Tvastr / Owner access</p>
      <h1 className="mt-5 text-4xl leading-tight">Approve your<br/><span className="text-txt-muted">local workspace.</span></h1>
      <p className="mt-5 text-sm leading-relaxed text-txt-muted">Only continue if you started this sign-in in Tvastr Control Panel. This approval opens a product-only local workspace for up to 15 minutes. Panel approvals allow health and maintenance audit only. Separately selected product maintenance approves Display Names for the exact product installation in your challenge. Neither grants customer-data access.</p>
      <label className="block mt-6 text-sm">Approval purpose<select className={input} value={purpose} disabled={busy||Boolean(factor)||Boolean(approval)} onChange={e=>{setPurpose(e.target.value);setChallenge('');}}><option value="panel">Panel workspace only</option><option value="maintenance">PIRAS Display Names maintenance</option></select></label>
      {!configured && <p role="alert" className="mt-5 text-sm text-red-600">Owner approval is not configured. No local or password-only fallback is enabled.</p>}
      {approval ? <section className="mt-8 space-y-4">
        <p>{purpose==='maintenance'?'Approved PIRAS installation: ':'Approved panel instance: '}<span className="break-all">{instance}</span></p>
        <label className="block text-sm" htmlFor="signed-approval">{purpose==='maintenance'?'Copy this product maintenance approval back to the same local panel.':'Copy the signed approval back to the same local panel.'}</label>
        <textarea className={input} id="signed-approval" readOnly value={approval} rows={5} spellCheck={false}/>
        <p className="text-xs text-txt-muted">Treat this as a short-lived access credential. Do not send it in messages or to another person.</p>
        <button className="underline underline-offset-4" onClick={()=>{setApproval('');setEmail('');setInstance('');setExpiresAt(0);}}>Clear approval</button>
      </section> : !factor ? <form className="mt-8 space-y-5" onSubmit={signIn}>
        <label className="block text-sm">Website email<input className={input} type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="username" required/></label>
        <label className="block text-sm">Website password<input className={input} type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required/></label>
        <button className="py-3 underline underline-offset-4 disabled:opacity-50" disabled={busy||!configured}>{busy?'Verifying...':'Continue to authenticator →'}</button>
      </form> : <form className="mt-8 space-y-5" onSubmit={approve}>
        <label className="block text-sm">Challenge from your local panel<textarea className={input} value={challenge} onChange={e=>setChallenge(e.target.value)} maxLength={4096} rows={4} required spellCheck={false} autoComplete="off"/></label>
        {purpose==='maintenance' && <p className="text-sm" role="status">{maintenanceSummary(challenge)}</p>}
        <label className="block text-sm">Authenticator code<input className={input} inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={e=>setCode(e.target.value)} autoComplete="one-time-code" required/></label>
        <button className="py-3 underline underline-offset-4 disabled:opacity-50" disabled={busy||!configured}>{busy?'Verifying...':(purpose==='maintenance'?'Approve this PIRAS installation →':'Approve this panel →')}</button>
      </form>}
      {error&&<p role="alert" className="mt-5 text-sm text-red-600">{error}</p>}
      <p className="mt-10 text-xs text-txt-muted">Fresh website sign-in and authenticator required. Your password is sent only to Supabase, never the local panel or approval service.</p>
    </div>
  </main>;
}
