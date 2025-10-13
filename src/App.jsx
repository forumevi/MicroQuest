import React, { useEffect } from "react";

let sdk;
try {
  sdk = await import("@farcaster/miniapp-sdk");
  console.log("Farcaster SDK loaded");
} catch (err) {
  console.warn("Farcaster SDK not found, using mockSDK");
  const { mockSDK } = await import("./lib/mockSDK.js");
  sdk = mockSDK;
}

export default function App() {
  useEffect(() => {
    console.log("startup: calling ready() on SDK");
    sdk.ready().then(() => {
      console.log("sdk.ready() resolved");
    });
  }, []);

  const handleJoin = () => {
    console.log("Join clicked");
    sdk.composeCast({
      text: "🚀 I joined MicroQuest!",
    });
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#6C5CE7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        color: "white",
      }}
    >
      <h1>MicroQuest</h1>
      <button
        onClick={handleJoin}
        style={{
          background: "white",
          color: "#6C5CE7",
          padding: "12px 20px",
          borderRadius: "10px",
          border: "none",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Join Quest
      </button>
    </div>
  );
}
