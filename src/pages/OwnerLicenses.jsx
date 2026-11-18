import { useAdminAccess } from '../context/admin-access-context';
import { CustomerLicenseTable } from './CustomerLicenseTable';

export function OwnerLicenses() {
  const { access, clear } = useAdminAccess();
  if (!access) return null;
  return <section className="text-txt-primary" aria-label="Secure customer license list">
    <div className="flex flex-wrap gap-4 text-xs text-txt-muted px-4 pt-4 pb-4">
      <span>{access.rows.length} {access.rows.length === 1 ? 'customer' : 'customers'}</span>
      <button className="underline" onClick={() => clear()}>Lock admin access</button>
      <span>Locks automatically after five minutes</span>
    </div>
    {access.rows.length === 0 ? <p className="p-8 text-center text-sm text-txt-muted">No customers found.</p> : <CustomerLicenseTable customers={access.rows} />}
  </section>;
}
