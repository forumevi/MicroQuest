import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config (ESM format)
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    rollupOptions: {
      // Farcaster SDK şu an npm’de yok, bu nedenle Vite derleme sırasında yokmuş gibi davranacak
      external: ['@farcaster/miniapp-sdk'],
    },
  },
});
