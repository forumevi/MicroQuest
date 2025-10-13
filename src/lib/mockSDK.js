// src/lib/mockSDK.js
export const mockSDK = {
  ready: async () => {
    console.log("[mockSDK] ready() called");
    return Promise.resolve();
  },
  composeCast: async (options) => {
    console.log("[mockSDK] composeCast called with:", options);
    alert(`Mock Cast: ${options.text}`);
    return Promise.resolve();
  },
};
