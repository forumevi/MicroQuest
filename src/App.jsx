import React, { useEffect, useState } from 'react';

export default function App() {
  const [sdk, setSdk] = useState(null);
  const [sdkError, setSdkError] = useState(null);
  const [loadingSdk, setLoadingSdk] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSdk() {
      setLoadingSdk(true);
      try {
        // dynamic import -> build sırasında paket yoksa hatayı yakalar
        const mod = await import('@farcaster/miniapp-sdk');
        if (!mounted) return;
        setSdk(mod);
        setSdkError(null);
      } catch (err) {
        console.warn('Farcaster SDK yüklenemedi:', err);
        if (!mounted) return;
        setSdk(null);
        setSdkError(err?.message || String(err));
      } finally {
        if (mounted) setLoadingSdk(false);
      }
    }

    loadSdk();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleDoSomething() {
    if (!sdk) return alert('SDK yüklenmedi.');
    try {
      // Burayı SDK'nın gerçek metodlarına göre düzenle.
      if (sdk.createSomething) {
        await sdk.createSomething({ example: true });
        alert('İstek gönderildi.');
      } else {
        alert('SDK yüklendi ama beklenen fonksiyon yok.');
      }
    } catch (err) {
      console.error('SDK işlem hatası:', err);
      alert('İşlem başarısız: ' + (err?.message || err));
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, Roboto, sans-serif' }}>
      <h1>MicroQuest</h1>

      {loadingSdk && <p>Loading Farcaster SDK…</p>}

      {!loadingSdk && sdk && (
        <div>
          <p>Farcaster SDK yüklendi ✅</p>
          <button onClick={handleDoSomething}>Do something with SDK</button>
        </div>
      )}

      {!loadingSdk && sdkError && (
        <div>
          <p style={{ color: 'crimson' }}>Farcaster SDK yüklenemedi:</p>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{String(sdkError)}</pre>
          <p>
            Eğer bu bir build-time (Rollup) hatasıysa, paketin <code>dependencies</code> içinde olduğunu ve
            <code>npm install</code> sonrası lockfile'ın commit edildiğini kontrol et.
          </p>
        </div>
      )}

      {!loadingSdk && !sdk && !sdkError && (
        <div>
          <p>Farcaster SDK mevcut değil — bazı özellikler kapalı olabilir.</p>
        </div>
      )}
    </div>
  );
}
