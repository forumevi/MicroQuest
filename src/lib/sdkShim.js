// src/lib/sdkShim.js
// Lightweight shim: use host-injected SDK if available; otherwise provide safe no-ops.
// This prevents build errors when the official @farcaster/miniapp-sdk package is not installed.

const noopAsync = async () => {};

const fallback = {
  actions: {
    ready: noopAsync,
    signin: noopAsync,
    composeCast: async (payload) => {
      // Fallback UX when running outside the Farcaster host.
      if (typeof window !== "undefined") {
        // eslint-disable-next-line no-alert
        alert(
          "Compose is not available outside the Farcaster client. Your draft:\n\n" +
            (payload?.text || "")
        );
      }
      return null;
    },
    addMiniApp: noopAsync,
    sendToken: noopAsync,
  },
  wallet: {
    getEthereumProvider: () => null,
  },
  context: {},
};

function getHostSdk() {
  if (typeof window === "undefined") return null;
  // Try common global names that a host might expose.
  if (window.sdk && typeof window.sdk === "object") return window.sdk;
  if (window.__FARCASTER_SDK__ && typeof window.__FARCASTER_SDK__ === "object")
    return window.__FARCASTER_SDK__;
  if (window.farcasterMiniApp && typeof window.farcasterMiniApp === "object")
    return window.farcasterMiniApp;
  return null;
}

const hostSdk = getHostSdk();
const sdk = hostSdk || fallback;

export default sdk;
