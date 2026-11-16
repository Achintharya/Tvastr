/* Synthetic identity and release fixtures only. */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
const mock = vi.hoisted(() => ({ create: vi.fn(), signIn: vi.fn(), signOut: vi.fn(), factors: vi.fn(), mfa: vi.fn(), session: vi.fn() }));
vi.mock('@supabase/supabase-js', () => ({ createClient: (...args) => {
  mock.create(...args); return { auth: { signInWithPassword: mock.signIn, signOut: mock.signOut, getSession: mock.session, mfa: { listFactors: mock.factors, challengeAndVerify: mock.mfa } } };
} }));
let OwnerDownload;
const release = { product: 'TvastrControlPanel', version: '0.2.0', platform: 'win32-x64', size: 12582912, sha256: 'a'.repeat(64), authenticode_verified: true, windows_accepted: true };
beforeAll(async () => {
  vi.stubEnv('VITE_SUPABASE_URL', 'https://synthetic.supabase.co');
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'synthetic-public-key');
  vi.stubEnv('VITE_OWNER_SERVICE_URL', 'https://owner.example');
  ({ OwnerDownload } = await import('../pages/OwnerDownload'));
});
beforeEach(() => {
  vi.clearAllMocks();
  mock.signIn.mockResolvedValue({ error: null }); mock.signOut.mockResolvedValue({});
  mock.factors.mockResolvedValue({ data: { totp: [{ id: 'synthetic-factor', status: 'verified' }] }, error: null });
  mock.mfa.mockResolvedValue({ error: null }); mock.session.mockResolvedValue({ data: { session: { access_token: 'synthetic-owner-token' } } });
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ manifest_b64: 'e30=', signature_b64: 'c2ln', certificate_pem: 'synthetic-public-certificate', release, download_url: 'https://synthetic.s3.example/temporary', expires_in: 60 }) }));
  localStorage.clear(); sessionStorage.clear();
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.useRealTimers(); });
async function signIn() {
  render(<OwnerDownload/>);
  fireEvent.change(screen.getByLabelText('Website email'), { target: { value: 'owner@example.invalid' } });
  fireEvent.change(screen.getByLabelText('Website password'), { target: { value: 'synthetic-password' } });
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: /Continue to authenticator/ })); });
}
async function download() {
  fireEvent.change(screen.getByLabelText('Authenticator code'), { target: { value: '123456' } });
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: /Get private download/ })); });
}
describe('private owner download', () => {
  it('uses a separate memory-only identity and sends no password to vendor', async () => {
    await signIn(); expect(fetch).not.toHaveBeenCalled();
    expect(mock.create.mock.calls.at(-1)[2].auth).toEqual({ storageKey: 'tvastr-owner-download-ephemeral', persistSession: false, autoRefreshToken: false, detectSessionInUrl: false });
    await download();
    const link = await screen.findByRole('link', { name: /Download Windows ZIP/ });
    expect(link.href).toBe('https://synthetic.s3.example/temporary');
    expect(link.getAttribute('referrerpolicy')).toBe('no-referrer');
    const [url, request] = fetch.mock.calls[0];
    expect(url).toBe('https://owner.example/api/owner/download');
    expect(request.headers.Authorization).toBe('Bearer synthetic-owner-token');
    expect(request.body).toBe(JSON.stringify({ release_id: 'current', platform: 'win32-x64' }));
    expect(request.credentials).toBe('omit'); expect(request.cache).toBe('no-store');
    expect(JSON.stringify(request)).not.toContain('synthetic-password');
    expect(mock.signOut).toHaveBeenCalledWith({ scope: 'local' });
    expect(screen.getByText(/Anyone holding it/)).toBeTruthy();
    expect(localStorage.length).toBe(0); expect(sessionStorage.length).toBe(0);
  });
  it('refuses password-only access', async () => {
    mock.factors.mockResolvedValue({ data: { totp: [] }, error: null });
    await signIn(); expect(screen.getByRole('alert').textContent).toContain('verified authenticator');
    expect(fetch).not.toHaveBeenCalled(); expect(mock.signOut).toHaveBeenCalled();
  });
  it('ends the session on rejected MFA', async () => {
    mock.mfa.mockResolvedValue({ error: new Error('bad') });
    await signIn(); await download();
    expect(screen.getByRole('alert').textContent).toContain('Authenticator verification failed');
    expect(fetch).not.toHaveBeenCalled(); expect(mock.signOut).toHaveBeenCalled();
  });
  it('shows unavailable rather than a fake download', async () => {
    fetch.mockResolvedValue({ ok: false, status: 503, json: async () => ({ detail: 'secret-storage-detail' }) });
    await signIn(); await download();
    expect(screen.getByRole('alert').textContent).toContain('No accepted Windows release');
    expect(screen.queryByRole('link', { name: /Download Windows ZIP/ })).toBeNull();
    expect(screen.getByRole('alert').textContent).not.toContain('secret-storage-detail');
    expect(mock.signOut).toHaveBeenCalled();
  });
  it.each(['javascript:alert(1)', 'http://insecure.example/file', 'https://user:password@external.invalid/file'])('refuses unsafe link %s', async url => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ manifest_b64: 'e30=', signature_b64: 'c2ln', certificate_pem: 'synthetic-public-certificate', release, download_url: url, expires_in: 60 }) });
    await signIn(); await download();
    expect(screen.getByRole('alert').textContent).toContain('Invalid release response');
    expect(screen.queryByRole('link', { name: /Download Windows ZIP/ })).toBeNull();
  });
  it.each([0, 61, '60'])('refuses invalid link lifetime %s', async expires_in => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ manifest_b64: 'e30=', signature_b64: 'c2ln', certificate_pem: 'synthetic-public-certificate', release, download_url: 'https://synthetic.s3.example/file', expires_in }) });
    await signIn(); await download();
    expect(screen.getByRole('alert').textContent).toContain('Invalid release response');
  });
  it('removes an expired link and requires a new password sign-in', async () => {
    vi.useFakeTimers();
    await signIn(); await download();
    expect(screen.getByRole('link', { name: /Download Windows ZIP/ })).toBeTruthy();
    await act(async () => { vi.advanceTimersByTime(61000); });
    expect(screen.getByRole('alert').textContent).toContain('expired');
    expect(screen.getByLabelText('Website password').value).toBe('');
    expect(screen.queryByRole('link', { name: /Download Windows ZIP/ })).toBeNull();
  });
});
