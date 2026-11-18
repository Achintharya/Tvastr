/* Synthetic authenticator fixtures, never production setup keys. */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
const mock = vi.hoisted(() => ({ create: vi.fn(), password: vi.fn(), out: vi.fn(), user: vi.fn(), list: vi.fn(), enroll: vi.fn(), verify: vi.fn(), remove: vi.fn() }));
vi.mock('@supabase/supabase-js', () => ({createClient: (...args) => {
  mock.create(...args); return {auth: {signInWithPassword: mock.password, signOut: mock.out, getUser: mock.user,
    mfa: {listFactors: mock.list, enroll: mock.enroll, challengeAndVerify: mock.verify, unenroll: mock.remove}}};
}}));
const account = { id: 'synthetic-owner', email: 'owner@example.invalid' };
const existing = { id: 'working-phone', status: 'verified', friendly_name: 'Working phone' };
const newFactor = { id: 'new-factor', status: 'verified' };
let OwnerAuthenticator;
beforeAll(async () => {
  vi.stubEnv('VITE_SUPABASE_URL', 'https://synthetic.supabase.co'); vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'synthetic-public');
  vi.stubEnv('VITE_OWNER_SERVICE_URL', 'https://owner.example');
  ({OwnerAuthenticator} = await import('../pages/OwnerAuthenticator'));
});
beforeEach(() => {
  vi.clearAllMocks(); mock.password.mockResolvedValue({error:null}); mock.out.mockResolvedValue({});
  mock.user.mockResolvedValue({data:{user:account}}); mock.list.mockResolvedValue({data:{totp:[]}});
  mock.enroll.mockResolvedValue({data:{id:'new-factor',totp:{qr_code:'<svg xmlns="http://www.w3.org/2000/svg"></svg>',secret:'SYNTHETIC-NOT-A-KEY'}}});
  mock.verify.mockResolvedValue({error:null}); localStorage.clear(); sessionStorage.clear();
});
afterEach(() => {cleanup(); vi.useRealTimers();});
async function start() {
  render(<OwnerAuthenticator expectedUser={account}/>);
  fireEvent.click(screen.getByRole('button',{name:'Set up or check authenticators'}));
  fireEvent.change(screen.getByLabelText('Website password for authenticator settings'),{target:{value:'synthetic-password'}});
  await act(async () => {fireEvent.click(screen.getByRole('button',{name:'Verify password'}));});
}
async function showQR() { await act(async () => {fireEvent.click(screen.getByRole('button',{name:'Show setup QR'}));}); }
async function confirm() {
  fireEvent.change(screen.getByLabelText("New app's current code"),{target:{value:'123456'}});
  await act(async () => {fireEvent.click(screen.getByRole('button',{name:'Confirm authenticator'}));});
}
describe('private self-service app-code enrollment', () => {
  it('does not enroll until fresh password and exact current account verification and explicit setup click', async () => {
    await start(); expect(mock.enroll).not.toHaveBeenCalled();
    expect(mock.password).toHaveBeenCalledWith({email:account.email,password:'synthetic-password'});
    expect(mock.user).toHaveBeenCalled(); expect(mock.create.mock.calls[0][2].auth.persistSession).toBe(false);
    await showQR(); expect(screen.getByAltText('Private authenticator setup QR')).toBeTruthy();
    expect(mock.enroll).toHaveBeenCalledWith({factorType:'totp',friendlyName:'Microsoft Authenticator',issuer:'Tvastr'});
    expect(localStorage.length).toBe(0);expect(sessionStorage.length).toBe(0);
    expect(mock.verify).not.toHaveBeenCalled(); expect(mock.remove).not.toHaveBeenCalled();
  });
  it.each(['password','wrong-account','factor-query'])('fails closed before enrollment on %s',async kind => {
    if(kind === 'password') mock.password.mockResolvedValue({error:{}});
    if(kind === 'wrong-account') mock.user.mockResolvedValue({data:{user:{id:'wrong'}}});
    if(kind === 'factor-query') mock.list.mockResolvedValue({error:{}});
    await start();expect(screen.getByRole('alert')).toBeTruthy();expect(screen.queryByRole('button',{name:'Show setup QR'})).toBeNull();
    expect(mock.enroll).not.toHaveBeenCalled();expect(mock.out).toHaveBeenCalled();
  });
  it('requires an existing factor code before adding a backup and never replaces active factors', async () => {
    mock.list.mockResolvedValue({data:{totp:[existing]}});await start();
    expect(screen.getAllByText(/Working phone/).length).toBe(2);expect(screen.queryByRole('button',{name:'Show setup QR'})).toBeNull();
    fireEvent.change(screen.getByLabelText('Current authenticator code'),{target:{value:'123456'}});
    await act(async()=>{fireEvent.click(screen.getByRole('button',{name:'Verify current authenticator'}));});
    expect(mock.verify).toHaveBeenCalledWith({factorId:existing.id,code:'123456'});await showQR();
    expect(mock.enroll).toHaveBeenCalled(); expect(mock.remove).not.toHaveBeenCalled();
  });
  it('does not permit a backup on rejected existing code',async () => {
    mock.list.mockResolvedValue({data:{totp:[existing]}});mock.verify.mockResolvedValue({error:{}});await start();
    fireEvent.change(screen.getByLabelText('Current authenticator code'),{target:{value:'123456'}});
    await act(async()=>{fireEvent.click(screen.getByRole('button',{name:'Verify current authenticator'}));});
    expect(screen.getByRole('alert').textContent).toContain('not accepted');expect(mock.enroll).not.toHaveBeenCalled();
  });
  it('confirms service enrollment before reporting ready, clears setup and closes ephemeral session',async () => {
    await start();await showQR();mock.list.mockResolvedValue({data:{totp:[newFactor]}});await confirm();
    expect(screen.getByRole('status').textContent).toContain('Authenticator verified');expect(screen.queryByAltText('Private authenticator setup QR')).toBeNull();
    expect(screen.queryByText('SYNTHETIC-NOT-A-KEY')).toBeNull(); expect(mock.out).toHaveBeenCalledWith({scope:'local'});expect(mock.remove).not.toHaveBeenCalled();
  });
  it('does not claim activation when current factor list cannot confirm it',async () => {
    await start();await showQR();mock.list.mockResolvedValue({error:{}});await confirm();
    expect(screen.getByRole('status').textContent).toContain('could not be rechecked');expect(mock.remove).not.toHaveBeenCalled();
  });
  it('keeps setup for one retry after rejected new code, with no replacement or enrollment reset',async () => {
    await start();await showQR();mock.verify.mockResolvedValue({error:{}});await confirm();
    expect(screen.getByRole('alert').textContent).toContain('Code not accepted');expect(screen.getByAltText('Private authenticator setup QR')).toBeTruthy();
    expect(mock.enroll).toHaveBeenCalledTimes(1);expect(mock.remove).not.toHaveBeenCalled();
  });
  it('clears setup after five minutes without ever removing a potentially active factor',async () => {
    vi.useFakeTimers();await start();await showQR();
    await act(async()=>{vi.advanceTimersByTime(300000);});
    expect(screen.queryByAltText('Private authenticator setup QR')).toBeNull();expect(screen.getByRole('status').textContent).toContain('expired');expect(mock.remove).not.toHaveBeenCalled();
  });
  it('does not resurrect setup when enrollment returns after the security session expires',async () => {
    vi.useFakeTimers();await start();let done;mock.enroll.mockReturnValue(new Promise(resolve=>{done=resolve;}));
    fireEvent.click(screen.getByRole('button',{name:'Show setup QR'}));
    await act(async()=>{vi.advanceTimersByTime(300000);});
    await act(async()=>{done({data:{id:'late',totp:{qr_code:'<svg/>',secret:'SYNTHETIC'}}});});
    expect(screen.queryByAltText('Private authenticator setup QR')).toBeNull();expect(mock.remove).not.toHaveBeenCalled();
  });
});
