import { defineConfig, devices } from '@playwright/test'
import { ADMIN, CASHIER } from './e2e/credentials'

// Отдельные порты, чтобы не пересекаться с запущенными dev-серверами.
// 127.0.0.1 вместо localhost: иначе Vite может слушать только IPv6 (::1)
const API_PORT = 3001
const WEB_PORT = 5174
const WEB_URL = `http://127.0.0.1:${WEB_PORT}`
const API_URL = `http://127.0.0.1:${API_PORT}/api`

export default defineConfig({
  testDir: './e2e',
  // Тесты работают с одной базой — по одному
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: WEB_URL,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      // Бэкенд на отдельной базе <DATABASE_URL>_e2e: миграции, очистка, seed
      command: 'npm run e2e:server',
      cwd: '../CoffeeBackend',
      url: `${API_URL}/health`,
      timeout: 120_000,
      env: {
        PORT: String(API_PORT),
        JWT_SECRET: 'e2e-secret',
        CLIENT_ORIGIN: WEB_URL,
        SEED_ADMIN_EMAIL: ADMIN.email,
        SEED_ADMIN_PASSWORD: ADMIN.password,
        SEED_CASHIER_EMAIL: CASHIER.email,
        SEED_CASHIER_PASSWORD: CASHIER.password,
      },
    },
    {
      command: `npm run dev -- --host 127.0.0.1 --port ${WEB_PORT} --strictPort`,
      url: WEB_URL,
      env: { VITE_API_URL: API_URL },
    },
  ],
})
