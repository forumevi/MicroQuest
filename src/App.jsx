// src/App.jsx
import React, { useEffect, useState } from 'react';
import sdk from './lib/sdkShim';

export default function App() {
  const [status, setStatus] = useState('loading');
  const [logs, setLogs] = useState([]);

  function addLog(l){ setLogs(prev => [...prev, (new Date()).toISOString() + ' — ' + l]); }

  useEffect(() => {
    (async () => {
      try {
        console.log('App: sdk object:', sdk);
        addLog('App: sdk object present? ' + !!sdk);
        if (sdk && sdk.actions && typeof sdk.actions.ready === 'function') {
          addLog('App: calling sdk.actions.ready()');
          await sdk.actions.ready();
          addLog('App: sdk.actions.ready() resolved');
        } else {
          addLog('App: sdk.actions.ready not available (web fallback)');
        }
        setStatus('ready');
      } catch (err) {
        console.error('App ready error', err);
        addLog('App ready error: ' + (err && err.message));
        setStatus('error');
      }
    })();
  }, []);

  const handleJoinQuest = async () => {
    try {
      addLog('Join clicked – calling composeCast if available');
      if (sdk && sdk.actions && typeof sdk.actions.composeCast === 'function') {
        await sdk.actions.composeCast({ text: `I joined MicroQuest!` });
        addLog('composeCast called');
      } else {
        addLog('composeCast not available — fallback alert');
        await sdk.actions.composeCast({ text: `I joined MicroQuest!` });
      }
    } catch (e) {
      console.error('composeCast failed', e);
      addLog('composeCast failed: ' + (e && e.message));
      alert('Submission failed. If you are in Farcaster client, try again.');
    }
  };

  return (
    <div style={{fontFamily:'Inter, Arial, sans-serif',padding:20}}>
      <header>
        <h1>MicroQuest</h1>
        <div>Status: {status}</div>
      </header>

      <main>
        <p>Complete quick quests on Farcaster.</p>
        <button onClick={handleJoinQuest} style={{padding:'10px 18px', borderRadius:8}}>Join Quest</button>

        <section style={{marginTop:20}}>
          <h3>Debug logs (latest)</h3>
          <div style={{maxHeight:200, overflow:'auto', background:'#f7f7f7', padding:10}}>
            {logs.length === 0 ? <i>No logs yet</i> : logs.slice().reverse().map((l,i)=>(<div key={i} style={{fontSize:12}}>{l}</div>))}
          </div>
        </section>
      </main>
    </div>
  );
}
