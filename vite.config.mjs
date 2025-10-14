import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Vite'in dev/optimize aşamasında bu paketi zorla çözmesi için
    include: ['@farcaster/miniapp-sdk']
  },
  resolve: {
    // Gerekirse alias ekleyebilirsin. Genelde boş bırak.
    // alias: { '@farcaster/miniapp-sdk': '/node_modules/@farcaster/miniapp-sdk/dist/index.mjs' }
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      // Genelde external kullanma; önce dependency ekle.
      // external: []
    }
  }
});
