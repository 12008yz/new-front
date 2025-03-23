import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    polyfills: ['polyfills.js'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
    cors: true,
  },
  define: {
    'process.env.VITE_PASSWORD_KEY': 'your_password_key_here',
  },
});