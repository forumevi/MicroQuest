```js
// Example light wrapper around Farcaster Mini App SDK calls used in the UI.
// Keep the wrapper minimal — most apps call sdk.actions.* directly.
import { sdk } from '@farcaster/miniapp-sdk'


export async function readyOrTimeout(timeoutMs = 3000) {
if (sdk && sdk.actions && typeof sdk.actions.ready === 'function') {
return await sdk.actions.ready()
}
// fallback: allow local dev
return new Promise(resolve => setTimeout(resolve, timeoutMs))
}


export async function signin() {
if (!sdk || !sdk.actions || !sdk.actions.signin) throw new Error('signin not available')
return await sdk.actions.signin()
}


export async function composeCast(cast) {
if (!sdk || !sdk.actions || !sdk.actions.composeCast) throw new Error('composeCast not available')
return await sdk.actions.composeCast(cast)
}
```
