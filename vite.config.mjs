import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [] // boş bırakıyoruz; dinamik import'u *vite-ignore* ile kontrol edeceğiz
  },
  resolve: {
    // alias gerekirse ekle
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      // bunları boş bırakıyoruz; dışarı alma yerine import'u runtime'a bırakacağız
    }
  }
});
