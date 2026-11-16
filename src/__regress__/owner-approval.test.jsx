/* Isolated owner flow. All auth/network values are synthetic fixtures. */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const mock = vi.hoisted(() => ({create:vi.fn(),signIn:vi.fn(),signOut:vi.fn(),factors:vi.fn(),mfa:vi.fn(),session:vi.fn()}));
vi.mock('@supabase/supabase-js',()=>({createClient:(...args)=>{mock.create(...args);return {auth:{signInWithPassword:mock.signIn,signOut:mock.signOut,getSession:mock.session,mfa:{listFactors:mock.factors,challengeAndVerify:mock.mfa}}};}}));
let OwnerApproval;
beforeAll(async()=>{
  vi.stubEnv('VITE_SUPABASE_URL','https://synthetic.supabase.co');
  vi.stubEnv('VITE_SUPABASE_ANON_KEY','synthetic-public-key');
  vi.stubEnv('VITE_OWNER_SERVICE_URL','https://owner.example');
  ({OwnerApproval}=await import('../pages/OwnerApproval'));
});
beforeEach(()=>{
  vi.clearAllMocks();
  mock.signIn.mockResolvedValue({error:null});mock.signOut.mockResolvedValue({});
  mock.factors.mockResolvedValue({data:{totp:[{id:'factor-fixture',status:'verified'}]},error:null});
  mock.mfa.mockResolvedValue({error:null});mock.session.mockResolvedValue({data:{session:{access_token:'synthetic-supabase-token'}}});
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({approval:'synthetic-signed-panel-approval',instance:'synthetic-instance',expires_at:Math.floor(Date.now()/1000)+800})}));
  localStorage.clear();sessionStorage.clear();
});
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
async function passwordStep(){
  render(<OwnerApproval/>);
  fireEvent.change(screen.getByLabelText('Website email'),{target:{value:'owner@example.invalid'}});
  fireEvent.change(screen.getByLabelText('Website password'),{target:{value:'synthetic-password-not-real'}});
  await act(async()=>{fireEvent.click(screen.getByRole('button',{name:/Continue to authenticator/}));});
  await screen.findByLabelText('Authenticator code');
}
async function approveStep(){
  fireEvent.change(screen.getByLabelText('Challenge from your local panel'),{target:{value:'synthetic-challenge'}});
  fireEvent.change(screen.getByLabelText('Authenticator code'),{target:{value:'123456'}});
  await act(async()=>{fireEvent.click(screen.getByRole('button',{name:/Approve this panel/}));});
}
describe('isolated owner approval',()=>{
  it('uses a separate memory-only client with no URL session detection',()=>{
    render(<OwnerApproval/>);
    const options=mock.create.mock.calls.at(-1)[2].auth;
    expect(options).toEqual({storageKey:'tvastr-owner-approval-ephemeral',persistSession:false,autoRefreshToken:false,detectSessionInUrl:false});
    expect(localStorage.length).toBe(0);expect(sessionStorage.length).toBe(0);
  });
  it('requires password before MFA and never sends password to the approval service',async()=>{
    await passwordStep();
    expect(mock.signIn).toHaveBeenCalledWith({email:'owner@example.invalid',password:'synthetic-password-not-real'});
    expect(fetch).not.toHaveBeenCalled();
    await approveStep();
    expect(await screen.findByLabelText('Copy the signed approval back to the same local panel.')).toBeTruthy();
    const [url,request]=fetch.mock.calls[0];expect(url).toBe('https://owner.example/api/owner/approve');
    expect(request.headers.Authorization).toBe('Bearer synthetic-supabase-token');
    expect(request.body).toBe(JSON.stringify({challenge:'synthetic-challenge'}));
    expect(JSON.stringify(request)).not.toContain('synthetic-password-not-real');
    expect(request.credentials).toBe('omit');expect(request.cache).toBe('no-store');
    expect(mock.signOut).toHaveBeenCalledWith({scope:'local'});
    expect(localStorage.length).toBe(0);expect(sessionStorage.length).toBe(0);
  });
  it('refuses a password-only account without a verified authenticator',async()=>{
    mock.factors.mockResolvedValue({data:{totp:[]},error:null});
    render(<OwnerApproval/>);
    fireEvent.change(screen.getByLabelText('Website email'),{target:{value:'owner@example.invalid'}});
    fireEvent.change(screen.getByLabelText('Website password'),{target:{value:'synthetic-password-not-real'}});
    await act(async()=>{fireEvent.click(screen.getByRole('button',{name:/Continue to authenticator/}));});
    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.getByRole('alert').textContent).toContain('No verified authenticator');
    expect(screen.getByLabelText('Website password').value).toBe('');
    expect(fetch).not.toHaveBeenCalled();expect(mock.signOut).toHaveBeenCalled();
  });
  it('ends the isolated sign-in after a wrong authenticator code',async()=>{
    mock.mfa.mockResolvedValue({error:new Error('synthetic MFA failure')});
    await passwordStep();await approveStep();
    await waitFor(()=>expect(screen.getByRole('alert').textContent).toContain('Authenticator verification failed'));
    expect(fetch).not.toHaveBeenCalled();expect(mock.signOut).toHaveBeenCalled();
    expect(screen.getByLabelText('Website password').value).toBe('');
  });
  it('does not expose an approval for a denied service response',async()=>{
    fetch.mockResolvedValue({ok:false,json:async()=>({detail:'untrusted-service-detail'})});
    await passwordStep();await approveStep();
    await waitFor(()=>expect(screen.getByRole('alert').textContent).toContain('Owner approval denied'));
    expect(screen.queryByLabelText('Copy the signed approval back to the same local panel.')).toBeNull();
    expect(screen.getByRole('alert').textContent).not.toContain('untrusted-service-detail');
    expect(mock.signOut).toHaveBeenCalled();
  });
  it('rejects malformed or overlong approval expiry',async()=>{
    fetch.mockResolvedValue({ok:true,json:async()=>({approval:'synthetic',instance:'synthetic',expires_at:Math.floor(Date.now()/1000)+3600})});
    await passwordStep();await approveStep();
    await waitFor(()=>expect(screen.getByRole('alert').textContent).toContain('Invalid approval response'));
    expect(screen.queryByLabelText('Copy the signed approval back to the same local panel.')).toBeNull();
  });
  it('cleans the dedicated identity session on unmount',()=>{
    const {unmount}=render(<OwnerApproval/>);unmount();
    expect(mock.signOut).toHaveBeenCalledWith({scope:'local'});
  });
});

describe('product maintenance approval',()=>{
  it('keeps panel as default and maintenance purpose explicit',()=>{
    render(<OwnerApproval/>);
    expect(screen.getByLabelText('Approval purpose').value).toBe('panel');
  });
  it('uses the separate maintenance endpoint and displays the exact installation',async()=>{
    render(<OwnerApproval/>);
    fireEvent.change(screen.getByLabelText('Approval purpose'),{target:{value:'maintenance'}});
    fireEvent.change(screen.getByLabelText('Website email'),{target:{value:'owner@example.invalid'}});
    fireEvent.change(screen.getByLabelText('Website password'),{target:{value:'synthetic'}});
    await act(async()=>{fireEvent.click(screen.getByRole('button',{name:/Continue to authenticator/}));});
    await screen.findByLabelText('Authenticator code');
    const installation='11111111-1111-4111-8111-111111111111';
    const challenge=btoa(JSON.stringify({payload:btoa(JSON.stringify({purpose:'tvastr-maintenance-challenge-v1',product:'piras',installation})),signature:'synthetic'}));
    fetch.mockResolvedValue({ok:true,json:async()=>({approval:'synthetic',instance:installation,product:'piras',expires_at:Math.floor(Date.now()/1000)+800})});
    fireEvent.change(screen.getByLabelText('Challenge from your local panel'),{target:{value:challenge}});
    expect(screen.getByRole('status').textContent).toContain(installation);
    fireEvent.change(screen.getByLabelText('Authenticator code'),{target:{value:'123456'}});
    await act(async()=>{fireEvent.click(screen.getByRole('button',{name:/Approve this PIRAS installation/}));});
    expect(fetch.mock.calls[0][0]).toBe('https://owner.example/api/owner/maintenance/approve');
    expect(fetch.mock.calls[0][1].body).toBe(JSON.stringify({challenge}));
    expect(await screen.findByText(/Approved PIRAS installation/)).toBeTruthy();
    expect(localStorage.length).toBe(0);expect(sessionStorage.length).toBe(0);
  });
});


it.each(['medhas','piras'])('keeps selected %s maintenance product bound through approval',async(product)=>{
  render(<OwnerApproval/>);
  fireEvent.change(screen.getByLabelText('Approval purpose'),{target:{value:product==='medhas'?'medhas':'maintenance'}});
  fireEvent.change(screen.getByLabelText('Website email'),{target:{value:'owner@example.invalid'}});
  fireEvent.change(screen.getByLabelText('Website password'),{target:{value:'synthetic'}});
  await act(async()=>{fireEvent.click(screen.getByRole('button',{name:/Continue to authenticator/}));});
  await screen.findByLabelText('Authenticator code');
  const installation='11111111-1111-4111-8111-111111111111';
  const encode=p=>btoa(JSON.stringify({payload:btoa(JSON.stringify({purpose:'tvastr-maintenance-challenge-v1',product:p,installation})),signature:'synthetic'}));
  fireEvent.change(screen.getByLabelText('Challenge from your local panel'),{target:{value:encode(product==='medhas'?'piras':'medhas')}});
  fireEvent.change(screen.getByLabelText('Authenticator code'),{target:{value:'123456'}});
  await act(async()=>{fireEvent.click(screen.getByRole('button',{name:/Approve this .* installation/}));});
  expect(fetch).not.toHaveBeenCalled();
  expect(screen.getByRole('alert').textContent).toContain('Challenge product does not match');
});
