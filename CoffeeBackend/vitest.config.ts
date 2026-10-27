import "dotenv/config";
import { defineConfig } from "vitest/config";
import { deriveDatabaseUrl } from "./tests/databaseUrl";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    env: {
      DATABASE_URL: deriveDatabaseUrl("_test"),
      JWT_SECRET: "test-secret",
      JWT_EXPIRES_IN: "1h",
    },
    globalSetup: "./tests/globalSetup.ts",
    setupFiles: "./tests/setup.ts",
    // Все файлы работают с одной базой — запускаем их по очереди
    fileParallelism: false,
  },
});
