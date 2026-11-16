import { createClient } from '@supabase/supabase-js';

export const ownerService = (import.meta.env.VITE_OWNER_SERVICE_URL || import.meta.env.VITE_UPDATE_SERVER_URL || '').replace(/\/$/, '');
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const ownerConfigured = /^https:\/\/[a-zA-Z0-9.-]+(?::443)?$/.test(ownerService) && /^https:\/\/[a-z0-9]+\.supabase\.co$/.test(supabaseUrl) && !!supabaseKey;

// One client per owner page mount; no shared portal session or persistent tokens.
export function createOwnerClient(purpose = 'download') {
  return ownerConfigured ? createClient(supabaseUrl, supabaseKey, { auth: {
    storageKey: 'tvastr-owner-' + purpose + '-ephemeral', persistSession: false,
    autoRefreshToken: false, detectSessionInUrl: false,
  } }) : null;
}
