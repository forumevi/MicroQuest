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
        const mod = await import("@farcaster/miniapp-sdk");
        if (!mounted) return;

        setSdk(mod);
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
    return () => { mounted = false; };
  }, []);

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

  const containerStyle = {
    padding: 32,
    fontFamily: "Inter, Roboto, sans-serif",
    maxWidth: 600,
    margin: "50px auto",
    backgroundColor: "#f7f7f7",
    borderRadius: 16,
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)"
  };

  const buttonStyle = {
    padding: "12px 24px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600
  };

  const connectButton = {
    ...buttonStyle,
    backgroundColor: "#6c5ce7",
    color: "#fff"
  };

  const actionButton = {
    ...buttonStyle,
    backgroundColor: "#00b894",
    color: "#fff"
  };

  const errorStyle = { color: "#d63031", backgroundColor: "#ffe6e6", padding: 12, borderRadius: 8 };

  const successStyle = { color: "#00b894", backgroundColor: "#e6fffa", padding: 12, borderRadius: 8 };

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: 24, textAlign: "center" }}>MicroQuest MiniApp</h1>

      {loadingSdk && <p style={{ textAlign: "center" }}>Loading Farcaster SDK…</p>}

      {!loadingSdk && sdk && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={successStyle}>Farcaster SDK yüklendi ✅</div>

          {!account && <button style={connectButton} onClick={connectAccount}>Connect Account</button>}

          {account && (
            <div style={{ padding: 12, backgroundColor: "#dfe6e9", borderRadius: 8 }}>
              Connected account: <strong>{account?.username || account?.id}</strong>
            </div>
          )}

          <button style={actionButton} onClick={doSomethingWithSdk}>Do something with SDK</button>
        </div>
      )}

      {!loadingSdk && sdkError && (
        <div style={errorStyle}>
          <p>Farcaster SDK yüklenemedi:</p>
          <pre style={{ whiteSpace: "pre-wrap" }}>{String(sdkError)}</pre>
        </div>
      )}

      {!loadingSdk && !sdk && !sdkError && (
        <p style={{ textAlign: "center" }}>Farcaster SDK mevcut değil.</p>
      )}
    </div>
  );
}
