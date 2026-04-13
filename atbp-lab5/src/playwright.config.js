// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests',  // Оставляем как у вас (если тесты в e2e/tests)
  timeout: 30000,  // Добавляем глобальный таймаут (из моего)
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],  // Для CI отчетов
    ['junit', { outputFile: 'test-results/junit.xml' }],    // Для CI отчетов
    ['list']  // Ваш list reporter
  ],

  use: {
    baseURL: 'http://localhost:5173',  // ✅ ВАЖНО: Vite порт!
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,  // Оставляем ваш таймаут
    navigationTimeout: 30000,  // Оставляем ваш таймаут
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',  // ✅ ВАЖНО: Vite порт!
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});