// src/lib/sdkShim.js
// Robust shim that tries many global names and logs what's available.
// Safe: only reads window and logs.

const noopAsync = async () => {};

function safeLog(...args) {
  try { console.log(...args); } catch (e) {}
}

function findHostSdk() {
  if (typeof window === 'undefined') return null;
  safeLog('sdkShim: scanning window for host SDK globals...');
  const common = ['sdk','__FARCASTER_SDK__','farcasterMiniApp','FarcasterMiniApp','FarcasterSDK','miniAppSdk'];
  for (const k of common) {
    try {
      if (window[k] && typeof window[k] === 'object') {
        safeLog('sdkShim: found candidate:', k);
        return window[k];
      }
    } catch(e){}
  }
  // Heuristic: find any object with actions.composeCast
  try {
    for (const key of Object.keys(window).slice(0,200)) {
      try {
        const val = window[key];
        if (val && typeof val === 'object' && val.actions && typeof val.actions.composeCast === 'function') {
          safeLog('sdkShim: heuristics found sdk at window.'+key);
          return val;
        }
      } catch(e){}
    }
  } catch(e){}
  safeLog('sdkShim: no host SDK found, using fallback shim');
  return null;
}

const host = findHostSdk();

const fallback = {
  actions: {
    ready: noopAsync,
    signin: noopAsync,
    composeCast: async (payload) => {
      // Friendly UI fallback: use an alert so user sees something outside Farcaster
      if (typeof window !== 'undefined') {
        try {
          // create simple modal if possible
          const msg = "Compose unavailable in this environment. Draft:\n\n" + (payload?.text || '');
          alert(msg);
        } catch(e){
          console.log('composeCast fallback:', payload);
        }
      }
      return null;
    },
    addMiniApp: noopAsync
  },
  wallet: {
    getEthereumProvider: () => null
  },
  context: {}
};

const sdk = host || fallback;
safeLog('sdkShim: final sdk used ->', !!host ? 'host' : 'fallback', host || {});
export default sdk;
