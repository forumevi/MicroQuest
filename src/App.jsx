// src/App.jsx
import { useEffect, useState } from "react";
import sdk from "./lib/sdkShim"; // use the shim instead of a missing npm package

export default function App() {
  const [quest, setQuest] = useState(
    "Share your favorite decentralized tool!"
  );
  const [status, setStatus] = useState("ready");

  useEffect(() => {
    // Call ready() if available on the host SDK (no-op in fallback)
    (async () => {
      try {
        if (sdk && sdk.actions && typeof sdk.actions.ready === "function") {
          await sdk.actions.ready();
        }
        setStatus("ready");
      } catch (err) {
        console.warn("SDK ready failed", err);
        setStatus("error");
      }
    })();
  }, []);

  const handleJoinQuest = async () => {
    try {
      if (sdk && sdk.actions && typeof sdk.actions.composeCast === "function") {
        await sdk.actions.composeCast({
          text: `🧩 Completing today's MicroQuest: ${quest}`,
        });
      } else {
        // fallback: the shim will alert the user outside host
        await sdk.actions.composeCast({ text: quest });
      }
    } catch (err) {
      console.error("composeCast failed", err);
      // Friendly UX fallback
      if (typeof window !== "undefined") {
        // eslint-disable-next-line no-alert
        alert("Failed to submit. Are you inside the Farcaster client?");
      }
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>MicroQuest</h1>
        <p className="subtitle">Complete today’s quest and earn your reward!</p>

        <div className="quest-box">
          <p className="quest-text">🎯 {quest}</p>
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button className="btn" onClick={handleJoinQuest}>
            Join Quest
          </button>
        </div>

        <div style={{ marginTop: 12, fontSize: 12, opacity: 0.85 }}>
          SDK status: {status}
        </div>
      </div>
    </div>
  );
}
