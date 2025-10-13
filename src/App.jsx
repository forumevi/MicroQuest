import { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    console.log("MicroQuest starting…");

    // Farcaster SDK global objesini bekle
    const interval = setInterval(() => {
      if (window.Farcaster && window.Farcaster.ready) {
        clearInterval(interval);
        console.log("SDK found, calling ready()");
        window.Farcaster.ready({ event: "MICROQUEST_READY" });
      }
    }, 200);
  }, []);

  const handleJoin = async () => {
    console.log("Join clicked");
    try {
      await window.Farcaster.composeCast({
        text: "I'm joining MicroQuest! 🚀",
        embeds: ["https://micro-quest.vercel.app"],
      });
      console.log("composeCast returned");
    } catch (err) {
      console.error("composeCast failed", err);
    }
  };

  return (
    <div className="app">
      <img src="/icon.svg" alt="icon" className="logo" />
      <h1>MicroQuest</h1>
      <p>Complete quick micro-challenges on Farcaster.</p>
      <button onClick={handleJoin}>Join Quest</button>
    </div>
  );
}

export default App;
