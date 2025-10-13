import React, { useEffect, useState } from 'react';
import sdk from './lib/sdkShim';

export default function App(){
  const [status, setStatus] = useState('loading');
  const [logs, setLogs] = useState([]);

  const addLog = (t) => setLogs(s=>[...s, `${new Date().toISOString()} — ${t}`]);

  useEffect(()=>{
    (async ()=>{
      addLog('App start, sdk present? ' + !!sdk);
      if(sdk && sdk.actions && typeof sdk.actions.ready === 'function'){
        addLog('Calling sdk.actions.ready()');
        try { await sdk.actions.ready(); addLog('sdk.ready resolved'); }
        catch(e){ addLog('sdk.ready error: ' + e?.message); }
      } else {
        addLog('No host sdk found — running fallback');
      }
      setStatus('ready');
    })();
  },[]);

  const handleJoin = async () => {
    addLog('Join clicked');
    if(sdk && sdk.actions && typeof sdk.actions.composeCast === 'function'){
      addLog('Calling composeCast');
      try {
        await sdk.actions.composeCast({ text: 'I joined MicroQuest!' });
        addLog('composeCast called');
      } catch(e) { addLog('composeCast errored: ' + e?.message); alert('Compose failed: '+ (e?.message||'unknown')); }
    } else {
      addLog('composeCast not available — showing fallback');
      await sdk.actions.composeCast({ text: 'I joined MicroQuest!' }); // fallback will alert
    }
  };

  return (
    <div style={{padding:20,fontFamily:'Inter, Arial, sans-serif'}}>
      <h1>MicroQuest</h1>
      <div>Status: {status}</div>
      <p>Note: If “Compose” is not available, you are likely viewing this outside an environment that injects Farcaster SDK (try Warpcast or the Farcaster client).</p>
      <button onClick={handleJoin}>Join Quest</button>
      <section style={{marginTop:20}}>
        <h4>Debug logs</h4>
        <div style={{maxHeight:200,overflow:'auto',background:'#f7f7f7',padding:8}}>
          {logs.length===0? <i>No logs yet</i> : logs.slice().reverse().map((l,i)=>(<div key={i} style={{fontSize:12}}>{l}</div>))}
        </div>
      </section>
    </div>
  );
}
