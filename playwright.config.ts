import { defineConfig, devices } from '@playwright/test';

const baseURL =
  process.env.GITHUB_ACTIONS === 'true'
    ? 'http://localhost:4173/cbnu-soft-eng-software-engineering-project-group-3/'
    : 'http://localhost:4173/';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command:
      'npm run build && npx vite preview --host localhost --port 4173 --strictPort',
    url: baseURL,
    reuseExistingServer: false,
  },
});
