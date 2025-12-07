import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const devProxyTarget = process.env.VITE_DEV_PROXY_TARGET || 'http://localhost:5000';

export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    // dev server settings only used by `vite` / `npm run dev`
    server: {
      host: '0.0.0.0',
      // only enable proxy in dev
      proxy: command === 'serve' ? {
        '/api': {
          target: devProxyTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api'), // optional
        },
      } : undefined,
    },
    // Optionally set base if your app is hosted in a subpath
    // base: process.env.VITE_BASE_URL || '/',
  };
});
