# --- Сборка: все зависимости, компиляция TypeScript ---
FROM node:24-alpine AS build
# Prisma на Alpine нужен OpenSSL
RUN apk add --no-cache openssl
WORKDIR /app

# Схема нужна уже при npm ci: postinstall запускает prisma generate
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
# prisma — production-зависимость (нужна для миграций), поэтому клиент можно
# перегенерировать после prune, чтобы он точно остался в node_modules
RUN npm run build && npm prune --omit=dev && npx prisma generate

# --- Запуск: только собранный код и production-зависимости ---
FROM node:24-alpine
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s \
  CMD wget -qO- "http://127.0.0.1:${PORT}/api/health" || exit 1

# Перед стартом применяем миграции; SEED_ON_START=true дополнительно создаёт
# аккаунты и демо-товары (seed идемпотентен, существующие данные не трогает).
# exec — чтобы Node получал SIGTERM напрямую и корректно завершался
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy &&if [ \"$SEED_ON_START\" = \"true\" ]; then node dist/prisma/seed.js; fi && exec node dist/src/index.js"]
