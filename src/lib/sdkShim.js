// src/lib/sdkShim.js
const noopAsync = async () => {};

function safeLog(...args){ try{ console.log(...args); }catch(e){} }

function findHostSdk(){
  if (typeof window === 'undefined') return null;
  safeLog('sdkShim: scanning window for host SDK globals...');
  const common = ['sdk','__FARCASTER_SDK__','farcasterMiniApp','FarcasterMiniApp','FarcasterSDK','miniAppSdk'];
  for(const k of common){
    try{
      if(window[k] && typeof window[k] === 'object'){
        safeLog('sdkShim: found global', k);
        return window[k];
      }
    }catch(e){}
  }
  // heuristic: look for any object with actions.composeCast
  try{
    for(const key of Object.keys(window).slice(0,200)){
      try{
        const val = window[key];
        if(val && typeof val === 'object' && val.actions && typeof val.actions.composeCast === 'function'){
          safeLog('sdkShim: heuristics found sdk at window.'+key);
          return val;
        }
      }catch(e){}
    }
  }catch(e){}
  safeLog('sdkShim: no host sdk found; using fallback shim');
  return null;
}

const host = findHostSdk();

const fallback = {
  actions: {
    ready: noopAsync,
    signin: noopAsync,
    composeCast: async (payload) => {
      // friendly fallback so user sees something
      const msg = "Compose not available in this environment. Draft:\n\n" + (payload?.text || '');
      try { alert(msg); } catch(e){ console.log(msg); }
      return null;
    },
    addMiniApp: noopAsync
  },
  wallet: { getEthereumProvider: () => null },
  context: {}
};

const sdk = host || fallback;
safeLog('sdkShim: using', host ? 'host sdk' : 'fallback shim', host || {});
export default sdk;
