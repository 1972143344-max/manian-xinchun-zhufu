import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const envBasePath = process.env.VITE_BASE_PATH?.trim();
  const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
  const basePath =
    envBasePath && envBasePath.length > 0
      ? envBasePath.endsWith('/')
        ? envBasePath
        : `${envBasePath}/`
      : mode === 'production' && repositoryName
        ? `/${repositoryName}/`
        : mode === 'production'
          ? './'
          : '/';

  return {
    base: basePath,
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: env.API_PROXY_TARGET || 'http://127.0.0.1:8787',
          changeOrigin: true,
        },
      },
    },
    plugins: [tailwindcss(), react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
