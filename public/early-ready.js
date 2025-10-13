// public/early-ready.js
(function(){
  try {
    var tries = 0;
    function findAndCall() {
      tries++;
      try {
        var candidates = [window.__FARCASTER_SDK__, window.sdk, window.farcasterMiniApp, window.FarcasterMiniApp];
        for (var i=0;i<candidates.length;i++) {
          var s = candidates[i];
          if (s && s.actions && typeof s.actions.ready === 'function') {
            try { s.actions.ready(); console.log('[early-ready] called ready on candidate', i); return true; } catch(e){console.warn('[early-ready] ready call failed', e); }
          }
        }
        // heuristic scan limited keys
        var keys = Object.keys(window).slice(0,200);
        for (var k=0;k<keys.length;k++){
          try {
            var val = window[keys[k]];
            if (val && val.actions && typeof val.actions.ready === 'function') {
              try { val.actions.ready(); console.log('[early-ready] called ready by heuristic', keys[k]); return true; } catch(e){}
            }
          } catch(e){}
        }
      } catch(e){}
      if (tries < 60) {
        setTimeout(findAndCall, 100); // try for ~6s total
      } else {
        console.log('[early-ready] giving up after tries');
      }
    }
    findAndCall();
  } catch(e){ console.warn('[early-ready] init error', e); }
})();
