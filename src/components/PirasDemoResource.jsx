import { useEffect, useRef, useState } from 'react';
import { useAdminAccess } from '../context/admin-access-context';
const TYPES = { video: 'video/mp4', captions: 'text/vtt', package: 'application/zip', windows: 'application/zip' };
const NAMES = { package: 'PIRAS-Demo-video-package.zip', windows: 'PIRAS-Demo-Windows-x64-preview.zip' };
export function PirasDemoResource() {
  const { request } = useAdminAccess();
  const [media, setMedia] = useState(null), [cc, setCc] = useState(false), [busy, setBusy] = useState(''), [error, setError] = useState('');
  const video = useRef(null), controller = useRef(null), urls = useRef([]), run = useRef(0);
  useEffect(() => () => {run.current++; controller.current?.abort(); urls.current.forEach(u => URL.revokeObjectURL(u));}, []);
  async function asset(kind, signal) {
    const response = await request('/api/owner/resources/' + kind, { signal: AbortSignal.any([signal, AbortSignal.timeout(90000)]) });
    if (!response.ok || !response.headers.get('content-type')?.startsWith(TYPES[kind])) throw new Error('Demo file unavailable. Check your portal session and try again when the server is ready.');
    const blob = await response.blob(); if (blob.size > 25000000) throw new Error('Demo file was too large.'); return blob;
  }
  async function load(kind) {
    const id = ++run.current; controller.current?.abort(); controller.current = new AbortController(); const signal = controller.current.signal;
    setBusy(kind); setError('');
    try {
      if (kind === 'video') {
        const v = await asset('video', signal), t = await asset('captions', signal);
        if (id !== run.current) return;
        urls.current.forEach(u => URL.revokeObjectURL(u)); urls.current = [URL.createObjectURL(v), URL.createObjectURL(t)];
        setMedia({ src: urls.current[0], track: urls.current[1] }); setCc(false);
      } else {
        const blob = await asset(kind, signal); if (id !== run.current) return;
        const u = URL.createObjectURL(blob), a = document.createElement('a'); a.href = u; a.download = NAMES[kind]; a.click();
        setTimeout(() => URL.revokeObjectURL(u), 1000);
      }
    } catch (e) {if (id === run.current && e.name !== 'AbortError') setError(e.message);}
    finally {if (id === run.current) setBusy('');}
  }
  function toggleCaptions() { const next = !cc; const tracks = video.current?.textTracks; if (tracks) for (let i=0;i<tracks.length;i++) tracks[i].mode = next ? 'showing' : 'disabled'; setCc(next); }
  return <section aria-label="PIRAS demo resource" className="p-6 md:p-10">
    <h2 className="text-xl md:text-2xl font-black tracking-tight">PIRAS Demo</h2>
    <p className="text-sm text-txt-muted mt-3">A 3 minute 17 second product walkthrough, with synthetic Casting Company data. Includes all 13 tabs, narration and optional English subtitles.</p>
    <style>{`.piras-demo-video::cue{background:transparent;color:white;text-shadow:-1px -1px 2px #000,1px -1px 2px #000,-1px 1px 2px #000,1px 1px 2px #000,0 2px 5px #000}`}</style>
    {media ? <div className="mt-6"><video className="piras-demo-video w-full rounded-lg bg-black" ref={video} controls preload="metadata" aria-label="PIRAS product walkthrough"><source src={media.src} type="video/mp4"/><track kind="subtitles" src={media.track} srcLang="en" label="English"/></video><button className="underline py-3 text-sm" aria-pressed={cc} onClick={toggleCaptions}>English subtitles: {cc ? 'On' : 'Off'}</button></div> : <button className="mt-5 px-5 py-3 rounded-lg bg-process-primary text-white text-sm font-semibold disabled:opacity-50" disabled={!!busy} onClick={() => load('video')}>Load video preview</button>}
    <div className="flex flex-wrap gap-3 mt-5"><button className="border border-current/20 rounded-lg px-5 py-3 text-sm font-semibold disabled:opacity-50" disabled={!!busy} onClick={() => load('package')}>Download video package</button><button className="border border-current/20 rounded-lg px-5 py-3 text-sm font-semibold disabled:opacity-50" disabled={!!busy} onClick={() => load('windows')}>Download Windows demo</button></div>
    {busy && <p role="status" className="text-sm text-txt-muted mt-4">Loading {busy === 'video' ? 'video preview' : 'download'}... The first request may take about a minute while the server wakes.</p>}
    {busy && <button className="underline text-sm py-2" onClick={() => {run.current++; controller.current?.abort(); setBusy('');}}>Cancel</button>}
    {error && <p role="alert" className="text-sm text-red-700 mt-4">{error}</p>}
    <p className="text-xs text-txt-muted mt-4">Portal login is required for these files. The Windows x64 demo is an unsigned preview and has not been tested on native Windows. No production services or customer data are included. The video package contains the MP4, subtitles and a player.</p>
  </section>;
}
