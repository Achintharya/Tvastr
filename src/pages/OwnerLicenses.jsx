import { useState } from 'react';
import { useAdminAccess } from '../context/admin-access-context';
import { CustomerLicenseTable } from './CustomerLicenseTable';

export function OwnerLicenses() {
  const { access, factors, busy, error, prepare, verify, lock } = useAdminAccess();
  const [code, setCode] = useState(''), [factor, setFactor] = useState('');
  if (access) return <section className="text-txt-primary" aria-label="Secure customer license list">
    <div className="flex flex-wrap gap-4 text-xs text-txt-muted px-4 pt-4 pb-4">
      <span>{access.rows.length} {access.rows.length === 1 ? 'customer' : 'customers'}</span>
      <button className="underline" onClick={() => lock()}>Lock customer access</button>
      <span>Locks automatically after five minutes</span>
    </div>
    {access.rows.length === 0 ? <p className="p-8 text-center text-sm text-txt-muted">No customers found.</p> : <CustomerLicenseTable customers={access.rows} />}
  </section>;
  return <section className="p-6 md:p-8 text-txt-primary" aria-label="Customer access verification">
    <h2 className="text-xl font-semibold">Customer list</h2>
    <p className="text-sm text-txt-muted my-4">Enter an authenticator code to view customer records. Access lasts five minutes. Resources and Docs remain available while the customer server wakes.</p>
    {!factors.length ? <button className="underline py-3 disabled:opacity-50" onClick={() => prepare()} disabled={busy}>{busy ? 'Checking authenticator...' : 'Open authenticator check'}</button> : <form onSubmit={async e => {e.preventDefault(); if (/^[0-9]{6}$/.test(code)) { const value = code; setCode(''); await verify(factor || factors[0].id, value); }}} className="max-w-sm space-y-4">
      {factors.length > 1 && <label className="block text-sm">Use authenticator<select value={factor || factors[0].id} onChange={e => setFactor(e.target.value)} className="block border rounded p-3" disabled={busy}>{factors.map(f => <option key={f.id} value={f.id}>{f.friendly_name || 'Authenticator'}</option>)}</select></label>}
      <label className="block text-sm">Authenticator code<input aria-label="Authenticator code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="one-time-code" required value={code} onChange={e => setCode(e.target.value)} disabled={busy} className="block border rounded-lg mt-2 px-3 py-3 w-full bg-transparent" /></label>
      <button className="underline py-3 disabled:opacity-50" disabled={busy}>{busy ? 'Loading customer list...' : 'Verify and open Customers'}</button>
    </form>}
    {error && <p role="alert" className="text-sm text-red-700 my-4">{error}</p>}
  </section>;
}
