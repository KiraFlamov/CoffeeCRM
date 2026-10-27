import { execSync } from "node:child_process";
import { deriveDatabaseUrl } from "./databaseUrl";

// Один раз перед всеми тестами: создаём тестовую базу (если её нет) и применяем миграции
export default function setup() {
  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: deriveDatabaseUrl("_test") },
  });
}
