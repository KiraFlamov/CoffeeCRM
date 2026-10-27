import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // E2E-тесты в e2e/ запускает Playwright
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
