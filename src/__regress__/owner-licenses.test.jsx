/* Synthetic owner and customer fixtures. No production access. */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
const mock = vi.hoisted(() => ({create:vi.fn(),signIn:vi.fn(),signOut:vi.fn(),factors:vi.fn(),mfa:vi.fn(),session:vi.fn()}));
vi.mock('@supabase/supabase-js', () => ({createClient:(...args)=>{mock.create(...args);return {auth:{signInWithPassword:mock.signIn,signOut:mock.signOut,getSession:mock.session,mfa:{listFactors:mock.factors,challengeAndVerify:mock.mfa}}};}}));
let OwnerLicenses;
const row={user_id:'synthetic-user',customer_name:'Synthetic customer',license_key:'synthetic-key',tier:'TIER_2',email:'synthetic@example.invalid',created_at:'2026-11-18'};
beforeAll(async()=>{
  vi.stubEnv('VITE_SUPABASE_URL','https://synthetic.supabase.co');
  vi.stubEnv('VITE_SUPABASE_ANON_KEY','synthetic-public-key');
  vi.stubEnv('VITE_OWNER_SERVICE_URL','https://owner.example');
  ({OwnerLicenses}=await import('../pages/OwnerLicenses'));
});
beforeEach(()=>{
  vi.clearAllMocks();mock.signIn.mockResolvedValue({error:null});mock.signOut.mockResolvedValue({});
  mock.factors.mockResolvedValue({data:{totp:[{id:'fixture-factor',status:'verified'}]},error:null});
  mock.mfa.mockResolvedValue({error:null});mock.session.mockResolvedValue({data:{session:{access_token:'synthetic-owner-token'}}});
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({licenses:[row],count:1})}));
  localStorage.clear();sessionStorage.clear();
});
afterEach(()=>{cleanup();vi.unstubAllGlobals();vi.useRealTimers();});
async function password(){
  render(<OwnerLicenses/>);
  fireEvent.change(screen.getByLabelText('Owner website email'),{target:{value:'owner@example.invalid'}});
  fireEvent.change(screen.getByLabelText('Owner website password'),{target:{value:'synthetic-password'}});
  await act(async()=>{fireEvent.click(screen.getByRole('button',{name:/Continue to authenticator/}));});
}
async function load(){
  fireEvent.change(screen.getByLabelText('Authenticator code'),{target:{value:'123456'}});
  await act(async()=>{fireEvent.click(screen.getByRole('button',{name:/Load customer licenses/}));});
}
describe('owner-only read-only license list',()=>{
  it('isolates memory-only credentials and uses only the authenticated server route',async()=>{
    await password();expect(fetch).not.toHaveBeenCalled();await load();
    expect(screen.getByText('Synthetic customer')).toBeTruthy();
    expect(mock.create.mock.calls.at(-1)[2].auth).toEqual({storageKey:'tvastr-owner-licenses-ephemeral',persistSession:false,autoRefreshToken:false,detectSessionInUrl:false});
    const [url,request]=fetch.mock.calls[0];expect(url).toBe('https://owner.example/api/owner/licenses');
    expect(request.headers.Authorization).toBe('Bearer synthetic-owner-token');expect(request.credentials).toBe('omit');expect(request.cache).toBe('no-store');
    expect(request.body).toBeUndefined();expect(JSON.stringify(request)).not.toContain('synthetic-password');
    expect(mock.signOut).toHaveBeenCalledWith({scope:'local'});expect(localStorage.length).toBe(0);expect(sessionStorage.length).toBe(0);
    fireEvent.click(screen.getByRole('button',{name:'Clear list'}));expect(screen.queryByText('synthetic-key')).toBeNull();
  });
  it('allows a verified backup factor to be selected for inventory',async()=>{
    mock.factors.mockResolvedValue({data:{totp:[{id:'primary',status:'verified',friendly_name:'Phone'},{id:'backup',status:'verified',friendly_name:'Backup'}]}});
    await password();fireEvent.change(screen.getByLabelText('Use authenticator'),{target:{value:'backup'}});await load();
    expect(mock.mfa).toHaveBeenCalledWith({factorId:'backup',code:'123456'});
  });
  it('refuses password-only identity',async()=>{
    mock.factors.mockResolvedValue({data:{totp:[]},error:null});await password();
    expect(screen.getByRole('alert').textContent).toContain('authenticator');expect(fetch).not.toHaveBeenCalled();expect(mock.signOut).toHaveBeenCalled();
  });
  it('refuses rejected MFA',async()=>{
    mock.mfa.mockResolvedValue({error:{}});await password();await load();
    expect(fetch).not.toHaveBeenCalled();expect(screen.getByRole('alert').textContent).toContain('verification failed');expect(mock.signOut).toHaveBeenCalled();
  });
  it.each([401,403,503])('fails closed on server status %s',async status=>{
    fetch.mockResolvedValue({ok:false,status,json:async()=>({detail:'private-storage-detail'})});await password();await load();
    expect(screen.queryByText('synthetic-key')).toBeNull();expect(screen.getByRole('alert').textContent).not.toContain('private-storage-detail');expect(mock.signOut).toHaveBeenCalled();
  });
  it.each([{licenses:{},count:0},{licenses:[row],count:2},{licenses:[{...row,email:1}],count:1},{licenses:Array(201).fill(row),count:201}])('rejects malformed or oversized output',async data=>{
    fetch.mockResolvedValue({ok:true,json:async()=>data});await password();await load();expect(screen.getByRole('alert').textContent).toContain('Invalid license');
  });
  it('clears sensitive rows after five minutes',async()=>{
    vi.useFakeTimers();await password();await load();expect(screen.getByText('synthetic-key')).toBeTruthy();
    await act(async()=>{vi.advanceTimersByTime(300000);});expect(screen.queryByText('synthetic-key')).toBeNull();expect(screen.getByRole('alert').textContent).toContain('cleared');
  });
});
