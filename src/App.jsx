import React, { useEffect, useState } from "react";

// Basit CSS spinner
const Spinner = () => (
  <div style={{
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #6c5ce7",
    borderRadius: "50%",
    width: 40,
    height: 40,
    animation: "spin 1s linear infinite",
    margin: "auto"
  }} />
);

// Spinner animasyonu
const spinnerStyle = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

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
    boxShadow: "0 12px 36px rgba(0,0,0,0.15)",
    textAlign: "center"
  };

  const buttonStyle = {
    padding: "12px 24px",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.2s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  };

  const connectButton = {
    ...buttonStyle,
    backgroundColor: "#6c5ce7",
    color: "#fff",
    marginBottom: 12
  };

  const actionButton = {
    ...buttonStyle,
    backgroundColor: "#00b894",
    color: "#fff"
  };

  const errorStyle = { color: "#d63031", backgroundColor: "#ffe6e6", padding: 12, borderRadius: 12 };
  const successStyle = { color: "#00b894", backgroundColor: "#e6fffa", padding: 12, borderRadius: 12 };

  const buttonHover = (e) => {
    e.target.style.transform = "scale(1.08)";
    e.target.style.boxShadow = "0 6px 18px rgba(0,0,0,0.2)";
  };

  const buttonLeave = (e) => {
    e.target.style.transform = "scale(1)";
    e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
  };

  return (
    <div style={containerStyle}>
      <style>{spinnerStyle}</style>
      <h1 style={{ marginBottom: 24 }}>MicroQuest MiniApp</h1>

      {loadingSdk && <Spinner />}

      {!loadingSdk && sdk && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          <div style={successStyle}>Farcaster SDK yüklendi ✅</div>

          {!account && (
            <button
              style={connectButton}
              onClick={connectAccount}
              onMouseEnter={buttonHover}
              onMouseLeave={buttonLeave}
            >
              Connect Account
            </button>
          )}

          {account && (
            <div style={{ padding: 12, backgroundColor: "#dfe6e9", borderRadius: 12, width: "100%" }}>
              Connected account: <strong>{account?.username || account?.id}</strong>
            </div>
          )}

          <button
            style={actionButton}
            onClick={doSomethingWithSdk}
            onMouseEnter={buttonHover}
            onMouseLeave={buttonLeave}
          >
            Do something with SDK
          </button>
        </div>
      )}

      {!loadingSdk && sdkError && (
        <div style={errorStyle}>
          <p>Farcaster SDK yüklenemedi:</p>
          <pre style={{ whiteSpace: "pre-wrap" }}>{String(sdkError)}</pre>
        </div>
      )}

      {!loadingSdk && !sdk && !sdkError && <p>Farcaster SDK mevcut değil.</p>}
    </div>
  );
}
