import React, { useEffect, useState } from 'react';

export default function App() {
  const [sdk, setSdk] = useState(null);
  const [sdkError, setSdkError] = useState(null);
  const [loadingSdk, setLoadingSdk] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSdkSafely() {
      setLoadingSdk(true);

      // Bu isim runtime'da oluşturuluyor — Vite/Rollup build-time çözümlemeye çalışmaz.
      const pkgName = '@farcaster/miniapp-sdk';

      // import(/* @vite-ignore */ pkgName) — Vite'e "bu import'u çözme" der.
      try {
        if (typeof window === 'undefined') {
          // SSR/build ortamı: SDK'yi deneme
          throw new Error('Not running in browser - skipping SDK load.');
        }

        // ÖNEMLİ: burada Vite'in build-time çözümlemesini engellemek için @vite-ignore comment'ını kullanıyoruz.
        // Not: runtime'da modül mevcut değilse bu import hata verecektir; bunu yakalıyoruz.
        // eslint-disable-next-line no-eval
        const mod = await eval(`import(/* @vite-ignore */ '${pkgName}')`);
        if (!mounted) return;
        setSdk(mod);
        setSdkError(null);
      } catch (err) {
        console.warn('Farcaster SDK yüklenemedi (runtime):', err);
        if (!mounted) return;
        setSdk(null);
        setSdkError(err?.message || String(err));
      } finally {
        if (mounted) setLoadingSdk(false);
      }
    }

    loadSdkSafely();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleDoSomething() {
    if (!sdk) return alert('SDK yüklenmedi.');
    try {
      if (sdk && typeof sdk.createSomething === 'function') {
        await sdk.createSomething({ example: true });
        alert('İstek gönderildi.');
      } else {
        alert('SDK yüklendi ama beklenen fonksiyon bulunamadı.');
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
            Bu geçici çözüm, build sırasında hatayı engeller. Kalıcı çözüm için paketi
            <code>dependencies</code>'e ekleyip lockfile'ı commit etmelisin.
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
