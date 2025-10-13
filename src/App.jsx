// src/App.jsx
import React, { useEffect, useState } from 'react';
import sdk from './lib/sdkShim';

export default function App() {
  const [status, setStatus] = useState('loading');
  const [logs, setLogs] = useState([]);

  const addLog = (t) => setLogs((s) => [...s, `${new Date().toISOString()} — ${t}`]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      addLog('App start, sdk present? ' + !!sdk);

      try {
        // Wait a bit so host can finish embed work (helps mobile splash behavior)
        await new Promise((r) => setTimeout(r, 400));

        if (sdk && sdk.actions && typeof sdk.actions.ready === 'function') {
          try {
            addLog('Calling sdk.actions.ready() (attempt 1)');
            await sdk.actions.ready();
            addLog('sdk.actions.ready() resolved (attempt 1)');
          } catch (e) {
            addLog('sdk.actions.ready() error (attempt 1): ' + (e?.message || e));
          }

          // second attempt after short delay to be extra-safe
          await new Promise((r) => setTimeout(r, 300));
          try {
            addLog('Calling sdk.actions.ready() (attempt 2)');
            await sdk.actions.ready();
            addLog('sdk.actions.ready() resolved (attempt 2)');
          } catch (e) {
            addLog('sdk.actions.ready() error (attempt 2): ' + (e?.message || e));
          }
        } else {
          addLog('sdk.actions.ready not available — running fallback');
        }
      } catch (err) {
        addLog('Error in ready flow: ' + (err?.message || err));
      }

      if (mounted) setStatus('ready');
    })();

    return () => { mounted = false; };
  }, []);

  const handleJoin = async () => {
    addLog('Join clicked');
    try {
      if (sdk && sdk.actions && typeof sdk.actions.composeCast === 'function') {
        addLog('Calling composeCast...');
        await sdk.actions.composeCast({ text: 'I joined MicroQuest!' });
        addLog('composeCast returned');
      } else {
        addLog('composeCast not available — using fallback (alert)');
        await sdk.actions.composeCast({ text: 'I joined MicroQuest!' }); // fallback alerts
      }
    } catch (e) {
      addLog('composeCast failed: ' + (e?.message || e));
      console.error('composeCast failed', e);
      alert('Submission failed. If you are in Farcaster client, try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg,#6C5CE7 0%, #a29bfe 100%)',
      color: '#fff',
      padding: 16,
      boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: 980, margin: '0 auto', background: 'rgba(255,255,255,0.06)', padding: 16, borderRadius: 12, position: 'relative', zIndex: 99999 }}>
        <h1 style={{ margin: 0 }}>MicroQuest</h1>
        <p style={{ opacity: 0.95 }}>Complete quick micro-challenges on Farcaster.</p>

        <div style={{ marginTop: 12 }}>
          <button
            onClick={handleJoin}
            style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: '#fff', color: '#6C5CE7', fontWeight: 700 }}
          >
            Join Quest
          </button>
        </div>

        <div style={{ marginTop: 16, background: 'rgba(0,0,0,0.2)', padding: 8, borderRadius: 8 }}>
          <strong>Debug logs (latest)</strong>
          <div style={{ maxHeight: 180, overflow: 'auto', marginTop: 8, background: '#fff', color: '#111', padding: 8, borderRadius: 6 }}>
            {logs.length === 0 ? <i>No logs yet</i> : logs.slice().reverse().map((l, i) => (<div key={i} style={{ fontSize: 12 }}>{l}</div>))}
          </div>
        </div>

        <div style={{ marginTop: 12, fontSize: 12, opacity: 0.95 }}>
          Status: {status}
        </div>

        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.9 }}>
          Note: If “Compose” is not available, you are likely viewing this outside an environment that injects Farcaster SDK (try Warpcast or the Farcaster client).
        </div>
      </div>
    </div>
  );
}
