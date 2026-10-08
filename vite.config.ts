import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  // The private key is read only by `npm run dev:gateway`, never by Vite.
  envDir: false,
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
      deny: ['.env', '.env.*', '.nev', '**/.git/**', '**/archive/mvp/**'],
    },
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}', 'server/**/*.test.mjs'],
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    restoreMocks: true,
    clearMocks: true,
  },
});
