import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://apps4.coop.ku.ac.th/chatbotService',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false, // ถ้า SSL self-signed
      },
    },
  },
});
