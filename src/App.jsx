import React, { useEffect, useState } from "react";
import * as farcasterSdk from "@farcaster/miniapp-sdk";

export default function App() {
  const [sdk] = useState(farcasterSdk);
  const [sdkError, setSdkError] = useState(null);
  const [loadingSdk, setLoadingSdk] = useState(true);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      setLoadingSdk(true);
      try {
        if (sdk.getCurrentAccount) {
          const acc = await sdk.getCurrentAccount();
          if (!mounted) return;
          setAccount(acc || null);
        }
        setSdkError(null);
      } catch (err) {
        console.error("Farcaster SDK yüklenemedi:", err);
        if (!mounted) return;
        setSdkError(err?.message || String(err));
      } finally {
        if (mounted) setLoadingSdk(false);
      }
    }

    init();
    return () => { mounted = false; };
  }, [sdk]);

  async function connectAccount() {
    if (!sdk.connectAccount) return alert("SDK veya fonksiyon mevcut değil");
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
    if (!sdk.createSomething) return alert("SDK veya fonksiyon mevcut değil");
    try {
      await sdk.createSomething({ example: true });
      alert("İstek başarıyla gönderildi ✅");
    } catch (err) {
      console.error("SDK işlem hatası:", err);
      alert("İşlem başarısız: " + (err?.message || err));
    }
  }

  // Stil tanımları
  const containerStyle = {
    padding: 32,
    fontFamily: "Inter, Roboto, sans-serif",
    maxWidth: 600,
    margin: "50px auto",
    backgroundColor: "#f7f7f7",
    borderRadius: 16,
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    textAlign: "center"
  };

  const buttonStyle = {
    padding: "12px 24px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    outline: "none"
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

  const errorStyle = {
    color: "#d63031",
    backgroundColor: "#ffe6e6",
    padding: 12,
    borderRadius: 8,
    animation: "fadeIn 0.3s ease"
  };

  const successStyle = {
    color: "#00b894",
    backgroundColor: "#e6fffa",
    padding: 12,
    borderRadius: 8,
    animation: "fadeIn 0.3s ease"
  };

  const buttonHover = (e) => {
    e.target.style.transform = "scale(1.05)";
    e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.25)";
  };

  const buttonLeave = (e) => {
    e.target.style.transform = "scale(1)";
    e.target.style.boxShadow = "none";
  };

  const spinner = (
    <div style={{ margin: "32px auto", width: 40, height: 40, border: "4px solid #ccc", borderTop: "4px solid #6c5ce7", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
  );

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: 24 }}>MicroQuest MiniApp</h1>

      {loadingSdk && spinner}

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
            <div style={{ padding: 12, backgroundColor: "#dfe6e9", borderRadius: 8, width: "100%" }}>
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

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
