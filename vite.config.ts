import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  // Keep local developer credential files entirely outside Vite's env loading.
  envDir: false,
  optimizeDeps: { entries: ['index.html'] },
  base:
    process.env.GITHUB_ACTIONS === 'true'
      ? '/cbnu-soft-eng-software-engineering-project-group-3/'
      : '/',
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    fs: {
      deny: [
        '.env',
        '.env.*',
        '.nev',
        '**/.git/**',
        '**/srt-translator-beta-3.html',
      ],
    },
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    restoreMocks: true,
    clearMocks: true,
  },
});
