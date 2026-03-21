import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Garante que o output do build vá para a pasta 'dist'
    // que a Vercel espera por padrão para o framework Vite
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    // Configuração para o desenvolvimento local
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});