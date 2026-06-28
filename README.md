# CoffeeCRM

Краткие инструкции по запуску backend и frontend в локальной среде.

Backend (CoffeeBackend):

1. Перейти в папку `CoffeeBackend`:

```bash
cd "d:/REACT APPS/CoffeeCRM/CoffeeBackend"
```

2. Скопировать `.env.example` в `.env` и заполнить значения.

3. Установить зависимости и сгенерировать Prisma клиент:

```bash
npm install
npx prisma generate
npx prisma migrate dev
```

4. Запустить в режиме разработки:

```bash
npm run dev
```

Frontend (CoffeeFrontend):

1. Перейти в папку `CoffeeFrontend`:

```bash
cd "d:/REACT APPS/CoffeeCRM/CoffeeFrontend"
```

2. Установить зависимости и запустить:

```bash
npm install
npm run dev
```
