import "./e2eEnv";
import { execSync } from "node:child_process";
import { createApp } from "../src/app";
import { config } from "../src/config";
import { resetDatabase } from "./helpers";

// Сервер для E2E-тестов (запускает Playwright из CoffeeFrontend):
// отдельная база, чистые данные и тестовые аккаунты из seed
async function main() {
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
  await resetDatabase();
  execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });

  createApp().listen(config.PORT, () => {
    console.log(`E2E server started on http://localhost:${config.PORT}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
