import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: 'frontend',
  plugins: [react()],
  // The private key is read only by `npm run dev:gateway`, never by Vite.
  envDir: false,
  build: { outDir: '../dist', emptyOutDir: true },
  optimizeDeps: { entries: ['index.html'] },
  base: '/',
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': 'http://localhost:8787',
    },
    fs: {
      deny: ['.env', '.env.*', '.nev', '**/.git/**', '**/docs/mvp/**'],
    },
  },
  test: {
    root: '.',
    include: [
      'frontend/src/**/*.test.{ts,tsx}',
      'backend/server/**/*.test.mjs',
    ],
    environment: 'jsdom',
    setupFiles: ['./frontend/src/test/setup.ts'],
    restoreMocks: true,
    clearMocks: true,
  },
});
