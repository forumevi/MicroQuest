import React, { useEffect, useState } from "react";

export default function App() {
  const [sdk, setSdk] = useState(null);
  const [sdkError, setSdkError] = useState(null);
  const [loadingSdk, setLoadingSdk] = useState(true);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadSdk() {
      setLoadingSdk(true);
      try {
        // Dinamik import
        const mod = await import("@farcaster/miniapp-sdk");
        if (!mounted) return;

        setSdk(mod);

        // Örnek: Hesap bağlıysa al
        if (mod.getCurrentAccount) {
          const acc = await mod.getCurrentAccount();
          setAccount(acc || null);
        }

        setSdkError(null);
      } catch (err) {
        console.error("Farcaster SDK yüklenemedi:", err);
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

  // Hesap bağlama örneği
  async function connectAccount() {
    if (!sdk || !sdk.connectAccount) return alert("SDK veya fonksiyon mevcut değil");
    try {
      const acc = await sdk.connectAccount();
      setAccount(acc);
      alert("Hesap bağlandı ✅");
    } catch (err) {
      console.error("Hesap bağlama hatası:", err);
      alert("Bağlama başarısız: " + (err?.message || err));
    }
  }

  // Örnek SDK işlevi
  async function doSomethingWithSdk() {
    if (!sdk || !sdk.createSomething) return alert("SDK veya fonksiyon mevcut değil");
    try {
      await sdk.createSomething({ example: true });
      alert("İstek başarıyla gönderildi ✅");
    } catch (err) {
      console.error("SDK işlem hatası:", err);
      alert("İşlem başarısız: " + (err?.message || err));
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: "Inter, Roboto, sans-serif" }}>
      <h1>MicroQuest</h1>

      {loadingSdk && <p>Loading Farcaster SDK…</p>}

      {!loadingSdk && sdk && (
        <div>
          <p>Farcaster SDK yüklendi ✅</p>

          {!account && (
            <button onClick={connectAccount} style={{ marginBottom: 8 }}>
              Connect Account
            </button>
          )}

          {account && (
            <p>
              Connected account: <strong>{account?.username || account?.id}</strong>
            </p>
          )}

          <button onClick={doSomethingWithSdk}>Do something with SDK</button>
        </div>
      )}

      {!loadingSdk && sdkError && (
        <div>
          <p style={{ color: "crimson" }}>Farcaster SDK yüklenemedi:</p>
          <pre style={{ whiteSpace: "pre-wrap" }}>{String(sdkError)}</pre>
        </div>
      )}

      {!loadingSdk && !sdk && !sdkError && <p>Farcaster SDK mevcut değil.</p>}
    </div>
  );
}
