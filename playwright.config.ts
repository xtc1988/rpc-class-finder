import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 30000,
  use: {
    actionTimeout: 0,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'electron',
      use: { 
        ...devices['Desktop Chrome'],
      },
    },
  ],

  webServer: [
    {
      command: 'npm run build:main',
      port: 9000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run dev:renderer',
      port: 9000,
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  ],
});