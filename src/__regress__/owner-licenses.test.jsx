/* Synthetic identities and rows only. No production network or real credentials. */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
const mock = vi.hoisted(() => ({create:vi.fn(),signIn:vi.fn(),signOut:vi.fn(),factors:vi.fn(),mfa:vi.fn(),session:vi.fn(),user:vi.fn(),customerSignIn:vi.fn(),portalSession:null,isAdmin:false}));
vi.mock('@supabase/supabase-js', () => ({createClient:(...args)=>{mock.create(...args);return {auth:{signInWithPassword:mock.signIn,signOut:mock.signOut,getSession:mock.session,getUser:mock.user,mfa:{listFactors:mock.factors,challengeAndVerify:mock.mfa}}};}}));
vi.mock('../context/auth-context',()=>({useAuth:()=>({signIn:mock.customerSignIn,session:mock.portalSession})}));
vi.mock('../context/license-context',()=>({useLicense:()=>({isAdmin:mock.isAdmin,loading:false})}));
let AdminAccessProvider, PortalLogin, AdminRoute, AdminDashboard;
const identity={id:'synthetic-owner',email:'achintharya@gmail.com'};
const row={user_id:'synthetic-user',customer_name:'Synthetic customer',license_key:'synthetic-key',tier:'TIER_2',email:'synthetic@example.invalid',created_at:'2026-11-18'};
beforeAll(async()=>{
  vi.stubEnv('VITE_SUPABASE_URL','https://synthetic.supabase.co');vi.stubEnv('VITE_SUPABASE_ANON_KEY','synthetic-public-key');vi.stubEnv('VITE_OWNER_SERVICE_URL','https://owner.example');
  ({AdminAccessProvider}=await import('../context/AdminAccessProvider'));
  ({PortalLogin}=await import('../pages/PortalLogin'));
  ({AdminRoute}=await import('../components/AdminRoute'));
  ({AdminDashboard}=await import('../pages/AdminDashboard'));
});
beforeEach(()=>{
  vi.clearAllMocks();mock.portalSession=null;mock.isAdmin=false;
  mock.signIn.mockResolvedValue({error:null});mock.signOut.mockResolvedValue({});mock.user.mockResolvedValue({data:{user:identity}});
  mock.customerSignIn.mockResolvedValue({error:null});
  mock.factors.mockResolvedValue({data:{totp:[{id:'fixture-factor',status:'verified',friendly_name:'Microsoft Authenticator'}]},error:null});
  mock.mfa.mockResolvedValue({error:null});mock.session.mockResolvedValue({data:{session:{access_token:'synthetic-owner-token'}}});
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({licenses:[row],count:1})}));
  localStorage.clear();sessionStorage.clear();
});
afterEach(()=>{cleanup();vi.unstubAllGlobals();vi.useRealTimers();});
function shell(path='/portal') {
  return render(<MemoryRouter initialEntries={[path]}><AdminAccessProvider><Routes><Route path="/portal" element={<PortalLogin/>}/><Route path="/portal/admin" element={<AdminRoute><AdminDashboard/></AdminRoute>}/><Route path="/portal/dashboard" element={<div>Normal customer dashboard</div>}/></Routes></AdminAccessProvider></MemoryRouter>);
}
async function password() {
  fireEvent.change(screen.getByLabelText('Email Address'),{target:{value:identity.email}});
  fireEvent.change(screen.getByLabelText('Password'),{target:{value:'synthetic-password'}});
  await act(async()=>{fireEvent.click(screen.getByRole('button',{name:'Sign in'}));});
}
async function verify() {
  fireEvent.change(screen.getByLabelText('Authenticator code'),{target:{value:'123456'}});
  await act(async()=>{fireEvent.click(screen.getByRole('button',{name:'Verify and open admin'}));});
}
describe('normal login hands verified owner inventory to the restored admin layout',()=>{
  it('opens admin only after password, current identity, MFA and accepted server inventory, without persistent secrets',async()=>{
    shell();await password();expect(fetch).not.toHaveBeenCalled();expect(screen.queryByText('System Administration')).toBeNull();
    expect(mock.customerSignIn).not.toHaveBeenCalled();
    const timeout=vi.spyOn(AbortSignal,'timeout');await verify();expect(timeout).toHaveBeenCalledWith(75000);timeout.mockRestore();
    expect(screen.getByText('System Administration')).toBeTruthy();expect(screen.getAllByText('Synthetic customer').length).toBe(2);
    expect(screen.getAllByRole('columnheader').map(th=>th.textContent)).toEqual(['Customer Name','Email','License Key','Tier','Created']);
    expect(screen.queryByLabelText('Password')).toBeNull();expect(screen.queryByLabelText('Authenticator code')).toBeNull();
    const [url,request]=fetch.mock.calls[0];expect(url).toBe('https://owner.example/api/owner/licenses');expect(request.headers.Authorization).toBe('Bearer synthetic-owner-token');expect(request.credentials).toBe('omit');expect(request.cache).toBe('no-store');expect(request.body).toBeUndefined();
    expect(mock.create.mock.calls[0][2].auth).toEqual({storageKey:'tvastr-owner-admin-login-ephemeral',persistSession:false,autoRefreshToken:false,detectSessionInUrl:false});
    expect(mock.signOut).toHaveBeenCalledWith({scope:'local'});expect(localStorage.length).toBe(0);expect(sessionStorage.length).toBe(0);
    const details=screen.getByText('Security settings').closest('details');expect(details.open).toBe(false);
    fireEvent.click(screen.getByRole('button',{name:'Lock admin access'}));expect(screen.queryByText('synthetic-key')).toBeNull();expect(screen.getByRole('button',{name:'Sign in'})).toBeTruthy();
  });
  it('does not accept an existing password-only admin portal session as admin access',()=>{
    mock.portalSession={user:identity};mock.isAdmin=true;shell('/portal/admin');expect(screen.getByRole('button',{name:'Sign in'})).toBeTruthy();expect(fetch).not.toHaveBeenCalled();
  });
  it('normal customer passwords still use the unchanged customer client and no MFA call',async()=>{
    shell();fireEvent.change(screen.getByLabelText('Email Address'),{target:{value:'customer@example.invalid'}});fireEvent.change(screen.getByLabelText('Password'),{target:{value:'synthetic-customer-password'}});
    await act(async()=>{fireEvent.click(screen.getByRole('button',{name:'Sign in'}));});
    expect(mock.customerSignIn).toHaveBeenCalledWith('customer@example.invalid','synthetic-customer-password');expect(mock.signIn).not.toHaveBeenCalled();expect(fetch).not.toHaveBeenCalled();
  });
  it('existing nonadmin customer session keeps redirecting to its normal dashboard',async()=>{
    mock.portalSession={user:{id:'customer'}};shell();expect(screen.getByText('Normal customer dashboard')).toBeTruthy();expect(fetch).not.toHaveBeenCalled();
  });
  it('allows a verified backup factor to be selected at login',async()=>{
    mock.factors.mockResolvedValue({data:{totp:[{id:'primary',status:'verified',friendly_name:'Phone'},{id:'backup',status:'verified',friendly_name:'Backup'}]}});shell();await password();fireEvent.change(screen.getByLabelText('Use authenticator'),{target:{value:'backup'}});await verify();expect(mock.mfa).toHaveBeenCalledWith({factorId:'backup',code:'123456'});
  });
  it.each(['password','identity','factors','no-factor'])('fails closed before MFA on %s failure',async kind=>{
    if(kind==='password')mock.signIn.mockResolvedValue({error:{}});
    if(kind==='identity')mock.user.mockResolvedValue({error:{}});
    if(kind==='factors')mock.factors.mockResolvedValue({error:{}});
    if(kind==='no-factor')mock.factors.mockResolvedValue({data:{totp:[]}});
    shell();await password();expect(screen.queryByLabelText('Authenticator code')).toBeNull();expect(fetch).not.toHaveBeenCalled();expect(mock.signOut).toHaveBeenCalled();
  });
  it('rejected MFA never fetches inventory',async()=>{
    mock.mfa.mockResolvedValue({error:{}});shell();await password();await verify();expect(fetch).not.toHaveBeenCalled();expect(screen.getByText(/Authenticator verification failed/)).toBeTruthy();expect(mock.signOut).toHaveBeenCalled();
  });
  it.each([401,403,503])('server rejection %s never opens the admin page',async status=>{
    fetch.mockResolvedValue({ok:false,status,json:async()=>({detail:'private-server-detail'})});shell();await password();await verify();expect(screen.queryByText('System Administration')).toBeNull();expect(screen.queryByText('private-server-detail')).toBeNull();expect(mock.signOut).toHaveBeenCalled();
  });
  it.each([{licenses:{},count:0},{licenses:[row],count:2},{licenses:[{...row,email:1}],count:1},{licenses:Array(201).fill(row),count:201}])('rejects malformed or oversized inventory',async data=>{
    fetch.mockResolvedValue({ok:true,json:async()=>data});shell();await password();await verify();expect(screen.getByText('Invalid license list response.')).toBeTruthy();expect(screen.queryByText('synthetic-key')).toBeNull();
  });
  it('empty accepted inventory still opens the guarded admin page',async()=>{
    fetch.mockResolvedValue({ok:true,json:async()=>({licenses:[],count:0})});shell();await password();await verify();expect(screen.getByText('No customers found.')).toBeTruthy();
  });
  it('expires all accepted rows and admin access at five minutes',async()=>{
    vi.useFakeTimers();shell();await password();await verify();expect(screen.getAllByText('synthetic-key').length).toBe(2);await act(async()=>{vi.advanceTimersByTime(300000);});expect(screen.queryByText('synthetic-key')).toBeNull();expect(screen.getByText('Admin access expired. Sign in again.')).toBeTruthy();
  });
  it('expires the pending password step at five minutes',async()=>{
    vi.useFakeTimers();shell();await password();await act(async()=>{vi.advanceTimersByTime(300000);});expect(screen.queryByLabelText('Authenticator code')).toBeNull();expect(screen.getByText(/Admin sign-in expired/)).toBeTruthy();expect(fetch).not.toHaveBeenCalled();
  });
  it('refresh/remount cannot recover access or rows',async()=>{
    const app=shell();await password();await verify();app.unmount();shell('/portal/admin');expect(screen.queryByText('synthetic-key')).toBeNull();expect(screen.getByRole('button',{name:'Sign in'})).toBeTruthy();expect(localStorage.length).toBe(0);
  });
  it('explicit logout clears admin rows and returns to login',async()=>{
    shell();await password();await verify();fireEvent.click(screen.getByRole('button',{name:'Logout'}));expect(screen.queryByText('synthetic-key')).toBeNull();expect(screen.getByRole('button',{name:'Sign in'})).toBeTruthy();
  });
  it('a response arriving after expiry cannot restore admin access',async()=>{
    vi.useFakeTimers();let finish;fetch.mockReturnValue(new Promise(resolve=>{finish=resolve;}));shell();await password();fireEvent.change(screen.getByLabelText('Authenticator code'),{target:{value:'123456'}});
    await act(async()=>{fireEvent.click(screen.getByRole('button',{name:'Verify and open admin'}));});
    await act(async()=>{vi.advanceTimersByTime(300000);});
    await act(async()=>{finish({ok:true,json:async()=>({licenses:[row],count:1})});});
    expect(screen.queryByText('synthetic-key')).toBeNull();expect(screen.getByRole('button',{name:'Sign in'})).toBeTruthy();
  });
});
