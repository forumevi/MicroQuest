import React, { useEffect, useState } from 'react';
import sdk from './lib/sdkShim';

export default function App() {
  const [status, setStatus] = useState('loading');
  const [logs, setLogs] = useState([]);
  const addLog = (t) => setLogs(s => [...s, `${new Date().toISOString()} — ${t}`]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      addLog('startup: calling ready() on Farcaster SDK');
      try {
        if (sdk && typeof sdk.ready === 'function') {
          await sdk.ready();
          addLog('sdk.ready() resolved');
          if (!cancelled) setStatus('ready');
        } else {
          addLog('SDK ready() not found');
          if (!cancelled) setStatus('ready (no host ready detected)');
        }
      } catch (e) {
        addLog('ready() call error: ' + (e?.message || e));
        if (!cancelled) setStatus('error');
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const handleJoin = async () => {
    addLog('Join clicked');
    try {
      if (sdk && typeof sdk.composeCast === 'function') {
        await sdk.composeCast({ text: 'I joined MicroQuest!' });
        addLog('composeCast returned');
      } else {
        addLog('composeCast not present on SDK');
      }
    } catch (e) {
      addLog('composeCast error: ' + (e?.message || e));
      alert('Compose failed: ' + (e?.message || e));
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
