// src/App.jsx
import React, { useEffect, useState } from 'react';
import sdk from './lib/sdkShim';

function findSdkImmediate() {
  if (typeof window === 'undefined') return null;
  const names = ['sdk','__FARCASTER_SDK__','farcasterMiniApp','FarcasterMiniApp','FarcasterSDK','miniAppSdk'];
  for (const n of names) {
    try {
      if (window[n] && typeof window[n] === 'object') return window[n];
    } catch(e){}
  }
  // heuristic
  try {
    for (const key of Object.keys(window).slice(0,200)) {
      try {
        const val = window[key];
        if (val && val.actions && typeof val.actions.ready === 'function') return val;
      } catch(e){}
    }
  } catch(e){}
  return null;
}

async function callReadyIfPresent(obj) {
  try {
    if (obj && obj.actions && typeof obj.actions.ready === 'function') {
      await obj.actions.ready();
      console.log('[microquest] called ready on', obj);
      return true;
    }
  } catch(e){
    console.warn('[microquest] ready call error', e);
  }
  return false;
}

export default function App(){
  const [status, setStatus] = useState('loading');
  const [logs, setLogs] = useState([]);
  const addLog = (t) => setLogs(s => [...s, `${new Date().toISOString()} — ${t}`]);

  useEffect(()=>{
    let cancelled = false;

    // 1) Immediate attempt using sdkShim export (if it points to host)
    (async ()=>{
      addLog('startup: beginning ready flow (immediate)');
      try {
        // try the shim object first
        if (sdk && sdk.actions && typeof sdk.actions.ready === 'function') {
          try {
            await sdk.actions.ready();
            addLog('sdkShim.ready() resolved (initial)');
          } catch(e) { addLog('sdkShim.ready() error (initial): ' + (e?.message||e)); }
        }
      } catch(e){ addLog('error calling sdkShim: ' + (e?.message||e)); }

      // 2) Poll loop: try frequently for a short period to find host-injected object early
      const maxMs = 5000; // poll up to 5s (adjust if needed)
      const start = Date.now();
      let found = false;
      while (!cancelled && (Date.now() - start) < maxMs) {
        const host = findSdkImmediate();
        if (host) {
          addLog('found host sdk candidate: ' + (host && host.name ? host.name : 'object') );
          // call ready up to 3 times spaced a bit
          for (let i=0;i<3;i++){
            const ok = await callReadyIfPresent(host);
            addLog('ready attempt ' + (i+1) + ' -> ' + ok);
            if (ok) { found = true; break; }
            await new Promise(r => setTimeout(r, 200));
          }
          if (found) break;
        }
        await new Promise(r => setTimeout(r, 150)); // 150ms poll
      }

      // 3) As fallback: try window.parent (in case host exposes there)
      if (!found && typeof window.parent !== 'undefined' && window.parent !== window) {
        try {
          const hostParent = window.parent.__FARCASTER_SDK__ || window.parent.sdk || null;
          if (hostParent) {
            addLog('found parent sdk candidate');
            const ok = await callReadyIfPresent(hostParent);
            addLog('parent ready -> ' + ok);
            if (ok) found = true;
          }
        } catch(e){ addLog('parent check error: ' + (e?.message||e)); }
      }

      // 4) Final: mark status
      if (!cancelled) {
        setStatus(found ? 'ready' : 'ready (no host ready detected)');
        addLog('done ready flow, ready called? ' + found);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const handleJoin = async () => {
    addLog('Join clicked');
    try {
      // use the best available object (shim or discovered)
      const host = findSdkImmediate() || sdk;
      if (host && host.actions && typeof host.actions.composeCast === 'function') {
        addLog('calling composeCast on host');
        await host.actions.composeCast({ text: 'I joined MicroQuest!' });
        addLog('composeCast returned');
      } else {
        addLog('composeCast not present — using fallback');
        await sdk.actions.composeCast({ text: 'I joined MicroQuest!' });
      }
    } catch(e){
      addLog('composeCast error: ' + (e?.message||e));
      alert('Compose failed: ' + (e?.message||e));
    }
  };

  return (
    <div style={{minHeight:'100vh',padding:16,fontFamily:'Inter, Arial, sans-serif',background:'linear-gradient(180deg,#6C5CE7 0%, #a29bfe 100%)'}}>
      <div style={{maxWidth:980,margin:'0 auto',background:'rgba(255,255,255,0.06)',padding:16,borderRadius:12}}>
        <h1>MicroQuest</h1>
        <p>Complete quick micro-challenges on Farcaster.</p>
        <button onClick={handleJoin} style={{padding:'10px 18px',borderRadius:8,background:'#fff',color:'#6C5CE7',fontWeight:700}}>Join Quest</button>
        <section style={{marginTop:16}}>
          <h4>Debug logs (latest)</h4>
          <div style={{maxHeight:200,overflow:'auto',background:'#fff',color:'#111',padding:8,borderRadius:6}}>
            {logs.length===0? <i>No logs yet</i> : logs.slice().reverse().map((l,i)=>(<div key={i} style={{fontSize:12}}>{l}</div>))}
          </div>
        </section>
        <div style={{marginTop:12,fontSize:12}}>Status: {status}</div>
      </div>
    </div>
  );
}
