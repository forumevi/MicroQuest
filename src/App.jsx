import { useEffect, useState } from "react";
import { actions } from "@farcaster/miniapp-sdk";

export default function App() {
  const [quest, setQuest] = useState("Share your favorite decentralized tool!");

  useEffect(() => {
    actions.ready();
  }, []);

  const handleJoinQuest = async () => {
    await actions.composeCast({
      text: `🧩 Completing today's MicroQuest: ${quest}`,
    });
  };

  return (
    <div className="app">
      <div className="card">
        <h1>MicroQuest</h1>
        <p className="subtitle">Complete today’s quest and earn your reward!</p>
        <div className="quest-box">
          <p className="quest-text">🎯 {quest}</p>
        </div>
        <button className="btn" onClick={handleJoinQuest}>
          Join Quest
        </button>
      </div>
    </div>
  );
}
