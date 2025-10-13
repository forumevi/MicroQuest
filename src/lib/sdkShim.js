// Dummy Farcaster SDK for local / Vercel build
export const sdk = {
  actions: {
    ready: async () => {
      console.log('[sdkShim] ready() called');
    },
    composeCast: async ({ text }) => {
      console.log('[sdkShim] composeCast:', text);
    }
  }
};

export default sdk;
