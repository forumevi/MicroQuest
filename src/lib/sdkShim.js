// Dummy SDK: ready() ve composeCast() sadece log atıyor
const sdk = {
  ready: async () => {
    console.log('[dummy SDK] ready() called');
    return true;
  },
  composeCast: async ({ text }) => {
    console.log('[dummy SDK] composeCast called with text:', text);
    return true;
  }
};

export default sdk;
