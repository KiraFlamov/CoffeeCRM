import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string({ error: "DATABASE_URL не задан" }).min(1, "DATABASE_URL не задан"),
  JWT_SECRET: z.string({ error: "JWT_SECRET не задан" }).min(1, "JWT_SECRET не задан"),
  JWT_EXPIRES_IN: z.string().default("1d"),
  PORT: z.coerce.number().int().positive().default(3000),
  // Можно указать несколько адресов через запятую
  CLIENT_ORIGIN: z.string().default("http://localhost:5173"),
  // Сколько прокси стоит перед сервером (на Render/Railway обычно 1).
  // Нужно, чтобы req.ip был адресом клиента, а не балансировщика
  TRUST_PROXY: z.coerce.number().int().min(0).default(isBehindPaasProxy() ? 1 : 0),
});

// Render и Railway сами выставляют эти переменные. Если забыть TRUST_PROXY,
// все запросы придут с IP балансировщика и лимит входа станет общим на всех
function isBehindPaasProxy() {
  return Boolean(process.env.RENDER || process.env.RAILWAY_ENVIRONMENT);
}

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Ошибка в переменных окружения:");
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

export const config = {
  ...parsed.data,
  CLIENT_ORIGINS: parsed.data.CLIENT_ORIGIN.split(",").map((origin) => origin.trim()),
};
