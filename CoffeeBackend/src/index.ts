import { config } from "./config";
import { createApp } from "./app";
import { prisma } from "./prisma/client";

const app = createApp();

const server = app.listen(config.PORT, () => {
  console.log(`Server started on http://localhost:${config.PORT}`);
});

// Docker и PaaS останавливают контейнер сигналом SIGTERM:
// дожидаемся текущих запросов и закрываем соединения с БД
const shutdown = (signal: NodeJS.Signals) => {
  console.log(`${signal}: останавливаем сервер`);

  server.close(() => {
    prisma.$disconnect().finally(() => process.exit(0));
  });

  // Если какой-то запрос завис — не ждём бесконечно
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
