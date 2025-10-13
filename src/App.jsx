import { useEffect, useState } from "react";
import { MiniAppSDK } from "./lib/farcaster-sdk";
import "./index.css";

function App() {
  const [status, setStatus] = useState("loading...");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      console.log("🚀 Starting MicroQuest init...");
      setStatus("Initializing SDK...");

      try {
        const sdk = new MiniAppSDK();
        console.log("startup: calling ready() on SDK");
        await sdk.ready();
        console.log("sdk.ready() resolved");
        setIsReady(true);
        setStatus("ready");
      } catch (err) {
        console.error("SDK init error:", err);
        setStatus("error");
      }
    };

    init();
  }, []);

  const handleJoinQuest = () => {
    console.log("Join clicked");
    setStatus("joining quest...");
    // örnek cast veya işlem
    setTimeout(() => {
      console.log("composeCast returned");
      setStatus("Quest joined ✅");
    }, 1000);
  };

  if (!isReady) {
    return (
      <div className="splash">
        <img src="/splash.png" alt="Splash" />
        <p className="status">Status: {status}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>MicroQuest</h1>
      <p>Complete quick micro-challenges on Farcaster.</p>
      <button onClick={handleJoinQuest}>Join Quest</button>
      <p className="status">Status: {status}</p>
    </div>
  );
}

export default App;
