```md
{
  "name": "MicroQuest",
  "description": "Complete small creative quests on Farcaster and earn rewards.",
  "url": "https://microquest.vercel.app",
  "icon": "https://microquest.vercel.app/icon.png",
  "buttonTitle": "Join Quest",
  "themeColor": "#6C5CE7"
}



English-first Mini App scaffold for Farcaster Mini Apps. Built with Vite + React and prepared for deployment on Vercel (connected to a GitHub repo).


### What this scaffold includes
- A lightweight React frontend that integrates with the Farcaster Mini App SDK (`@farcaster/miniapp-sdk`).
- Example usage of key SDK calls: `actions.ready()`, `actions.signin()`, `actions.composeCast()`, `actions.addMiniApp()`.
- Example `/.well-known/farcaster.json` manifest file (edit with your real URLs and signatures before publishing).
- A simple serverless endpoint stub (`/api/reward`) meant to be deployed on Vercel. Use it to trigger reward distribution or minting from a secure backend.


### Quick local dev
```bash
# install
npm install


# dev server
npm run dev
```


Open `http://localhost:5173` (default Vite port) and test the UI. When running as a standalone web app you will not get SDK actions — test the Farcaster SDK flows by previewing the app within Farcaster dev tools or as a published Mini App.


### Deploy to GitHub + Vercel
1. Create a GitHub repo and push this project.
2. In Vercel, `Import Project` → connect your GitHub repository.
3. Set these Environment Variables (Vercel dashboard → Settings → Environment):
- `REWARD_SECRET` — secret string used to authenticate reward webhooks (choose a long random value)
- `RPC_URL` — e.g. an RPC provider HTTP endpoint for on-chain actions (if you plan to mint/send tokens)
- `PRIVATE_KEY` — **(optional)** private key of the account that will pay gas / send tokens (keep secret)
- `NFT_CONTRACT_ADDRESS` — **(optional)** when you call a mint endpoint


4. Deploy. Vercel will run `npm run build` then publish.


### Publishing the manifest (important)
Place the `farcaster.json` manifest under `/.well-known/farcaster.json` at the root of your deployed domain (e.g. `https://mikrogorev.example/.well-known/farcaster.json`). Farcaster's Mini App directory reads this manifest. When publishing for production you will need to generate and attach the required `accountAssociation` JWS signature for domain verification (see Farcaster docs).


### Notes & next steps
- Replace placeholder images and URLs with your brand assets.
- Integrate a proper backend (GCP / Vercel serverless / AWS Lambda) to safely hold private keys and perform on-chain minting.
- Add moderation, rate-limiting and abuse protections before enabling rewards.# MicroQuest
