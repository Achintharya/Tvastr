import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';
import { LicenseContext } from '../context/license-context';
const mocks = vi.hoisted(() => ({ from: vi.fn(), contact: vi.fn() }));
vi.mock('../lib/supabaseClient', () => ({ supabase: { from: mocks.from } }));
vi.mock('../lib/config', async (original) => ({ ...(await original()), openContact: mocks.contact }));
import { PortalDashboard } from '../pages/PortalDashboard';
const signOut = vi.fn();
function show(overrides = {}) {
  return render(<MemoryRouter><AuthContext.Provider value={{ user: { email: 'synthetic@example.invalid' }, signOut }}><LicenseContext.Provider value={{ tier: 'TIER_2', customerName: 'Synthetic test company', capabilities: { ras_enterprise: true, vajra_enabled: true }, loading: false, isAdmin: false, ...overrides }}><PortalDashboard /></LicenseContext.Provider></AuthContext.Provider></MemoryRouter>);
}
beforeEach(() => { vi.clearAllMocks(); vi.stubGlobal('fetch', vi.fn()); });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
describe('customer installer downloads removed', () => {
  it('keeps entitled product cards, manual, support and logout without storage queries or download actions', () => {
    show();
    expect(screen.getByRole('heading', { name: 'Synthetic test company' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'PIRAS' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Vajra Cortex' })).toBeTruthy();
    expect(screen.getAllByText('Installation and updates are handled by Tvastr. Contact support to arrange assistance.')).toHaveLength(2);
    expect(screen.getByRole('link', { name: /User Manual/ }).getAttribute('href')).toBe('/portal/manual');
    expect(screen.queryByRole('button', { name: /download|rollback/i })).toBeNull();
    expect(screen.queryByText(/Loading versions|No releases|Latest Version|Stable rollback/i)).toBeNull();
    expect(mocks.from).not.toHaveBeenCalled(); expect(fetch).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Contact Support' })); expect(mocks.contact).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', { name: 'Logout' })); expect(signOut).toHaveBeenCalledOnce();
  });
  it('retains locked products and admin navigation without fetching releases', () => {
    show({ tier: 'TIER_1', capabilities: { ras_enterprise: true }, isAdmin: true });
    expect(screen.getByRole('link', { name: /Admin Portal/ }).getAttribute('href')).toBe('/portal/admin');
    expect(screen.getAllByText('Installation and updates are handled by Tvastr. Contact support to arrange assistance.')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Vajra Cortex' })).toBeTruthy();
    expect(mocks.from).not.toHaveBeenCalled(); expect(fetch).not.toHaveBeenCalled();
  });
  it('preserves license loading without advertising downloads', () => {
    const { container } = show({ loading: true }); expect(container.querySelector('.forge-loader-container')).toBeTruthy();
    expect(screen.queryByText(/Installation and updates are handled/)).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });
  it('keeps private owner and document downloads separate from deleted customer code', () => {
    const app = readFileSync('src/App.jsx', 'utf8');
    expect(app).toContain('path="/owner/download"'); expect(app).toContain('path="/owner/approve"');
    expect(app).not.toContain('path="/portal/downloads"');
    expect(readFileSync('src/pages/OwnerDownload.jsx', 'utf8')).toContain('/api/owner/download');
    expect(readFileSync('src/components/DownloadPresentationButton.jsx', 'utf8')).toContain('Download PDF');
    expect(readFileSync('src/pages/PortalManual.jsx', 'utf8')).toContain('Download PDF');
    expect(readFileSync('src/pages/PortalLogin.jsx', 'utf8')).not.toContain('system downloads');
    for (const f of ['src/pages/PortalDownloads.jsx', 'src/components/ProductDownloadCard.jsx', 'src/components/RollbackVersionCard.jsx']) expect(existsSync(f)).toBe(false);
    const dashboard = readFileSync('src/pages/PortalDashboard.jsx', 'utf8');
    for (const value of ['/api/download/', '.from("versions")', 'licenseKey', 'window.open']) expect(dashboard).not.toContain(value);
  });
});
