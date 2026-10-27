# --- Сборка статики ---
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Адрес API вшивается в бандл при сборке, поэтому это build arg, а не переменная запуска.
# На PaaS задайте VITE_API_URL в переменных сервиса — платформа передаст её при сборке
ARG VITE_API_URL
RUN test -n "$VITE_API_URL" || (echo "Передайте --build-arg VITE_API_URL=https://<api>/api" && exit 1)
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# --- Раздача через nginx ---
FROM nginx:1.29-alpine
# Порт подставляется из $PORT при старте (PaaS задаёт его сам), по умолчанию 80
ENV PORT=80
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
