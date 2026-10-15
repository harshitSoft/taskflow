import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_API_BASE_URL || 'http://16.4.54.161/api';
  const apiTarget = apiUrl.startsWith('http') 
    ? apiUrl.replace(/\/api\/?$/, '') 
    : 'http://16.4.54.161';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
