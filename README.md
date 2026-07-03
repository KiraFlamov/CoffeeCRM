# ☕ CoffeeCRM

**Full-stack приложение для управления кофейней (POS система)** с авторизацией, разграничением ролей и управлением товарами и заказами.

## 📋 Содержание
- [Возможности](#возможности)
- [Технологии](#технологии)
- [Предварительные требования](#предварительные-требования)
- [Установка](#установка)
- [Запуск](#запуск)
- [Структура проекта](#структура-проекта)
- [Переменные окружения](#переменные-окружения)
- [API Endpoints](#api-endpoints)
- [Роли и разрешения](#роли-и-разрешения)
- [Решение проблем](#решение-проблем)

## ✨ Возможности

- 🔐 **JWT-авторизация** — безопасная аутентификация пользователей
- 👥 **Разграничение ролей** — Администратор и Кассир с разными правами
- 📦 **Управление товарами** — добавление, редактирование, удаление товаров
- 🛒 **POS система** — быстрое создание заказов
- 📊 **История заказов** — просмотр всех заказов с фильтрацией
- 👤 **Управление пользователями** — создание и управление учетными записями
- 🔒 **Защищённые маршруты** — контроль доступа на уровне UI и API
- 📱 **Адаптивный дизайн** — удобно работает на разных устройствах

## 🛠 Технологии

### Frontend
| Технология | Версия | Назначение |
|-----------|--------|-----------|
| React | 18+ | UI framework |
| TypeScript | 5+ | Типизированный JavaScript |
| React Router | - | Маршрутизация |
| Axios | - | HTTP клиент |
| CSS | - | Стили |
| Vite | 5+ | Build tool |

### Backend
| Технология | Версия | Назначение |
|-----------|--------|-----------|
| Node.js | 18+ | Runtime |
| Express | 4+ | Web фреймворк |
| TypeScript | 5+ | Типизированный JavaScript |
| Prisma | - | ORM |
| PostgreSQL | 12+ | База данных |
| JWT | - | Аутентификация |
| bcrypt | - | Хеширование пароля |

## 📋 Предварительные требования

- **Node.js** (v18 или выше)
- **npm** или **yarn**
- **PostgreSQL** (локально или Docker)
- **Git** (опционально)

## 📦 Установка

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd "d:/REACT APPS/CoffeeCRM"
```

### 2. Backend установка

```bash
cd CoffeeBackend

# Установить зависимости
npm install

# Скопировать файл конфигурации
cp .env.example .env

# Заполнить переменные окружения (см. ниже)
# Отредактируйте .env файл с вашими данными
```

### 3. Frontend установка

```bash
cd ../CoffeeFrontend

# Установить зависимости
npm install
```

## 🚀 Запуск

### Backend

```bash
cd CoffeeBackend

# Генерировать Prisma клиент
npx prisma generate

# Выполнить миграции базы данных
npx prisma migrate dev

# Запустить в режиме разработки
npm run dev
```

Backend запустится на: **http://localhost:3000**

### Frontend

```bash
cd CoffeeFrontend

# Запустить в режиме разработки
npm run dev
```

Frontend будет доступен на: **http://localhost:5173**

## 📁 Структура проекта

```
CoffeeCRM/
├── CoffeeBackend/
│   ├── src/
│   │   ├── index.ts              # Entry point
│   │   ├── controllers/          # Обработчики запросов
│   │   ├── middleware/           # Express middleware
│   │   ├── routes/               # API маршруты
│   │   └── prisma/
│   │       └── client.ts         # Prisma клиент
│   ├── prisma/
│   │   ├── schema.prisma         # DB схема
│   │   └── migrations/           # Миграции
│   ├── package.json
│   └── tsconfig.json
│
├── CoffeeFrontend/
│   ├── src/
│   │   ├── pages/                # Страницы приложения
│   │   ├── components/           # Переиспользуемые компоненты
│   │   ├── api/                  # API запросы
│   │   ├── context/              # React Context (Auth)
│   │   ├── layout/               # Основной Layout
│   │   └── style/                # CSS файлы
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## 🔧 Переменные окружения

### Backend (.env)

```env
# База данных
DATABASE_URL="postgresql://user:password@localhost:5432/coffee_crm"

# JWT
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRATION="7d"

# Сервер
PORT=3000
NODE_ENV="development"
```

### Frontend (.env)

```env
VITE_API_URL="http://localhost:3000"
```

## 🔌 API Endpoints

### Аутентификация
- `POST /api/auth/register` — регистрация пользователя
- `POST /api/auth/login` — вход в систему
- `POST /api/auth/logout` — выход

### Товары
- `GET /api/products` — получить все товары
- `POST /api/products` — создать новый товар (Admin)
- `PUT /api/products/:id` — обновить товар (Admin)
- `DELETE /api/products/:id` — удалить товар (Admin)

### Заказы
- `GET /api/orders` — получить все заказы
- `POST /api/orders` — создать заказ
- `GET /api/orders/:id` — получить детали заказа

### Пользователи
- `GET /api/users` — получить всех пользователей (Admin)
- `POST /api/users` — создать пользователя (Admin)
- `PUT /api/users/:id` — обновить пользователя (Admin)
- `DELETE /api/users/:id` — удалить пользователя (Admin)

## 👥 Роли и разрешения

| Функция | Администратор | Кассир |
|---------|:-------------:|:------:|
| Вход в систему | ✅ | ✅ |
| Просмотр товаров | ✅ | ✅ |
| Управление товарами | ✅ | ❌ |
| Создание заказов | ✅ | ✅ |
| Просмотр заказов | ✅ | ✅ |
| Управление пользователями | ✅ | ❌ |
| Доступ к панели администратора | ✅ | ❌ |

## 🐛 Решение проблем

### Ошибка: "DATABASE_URL не установлена"
- Убедитесь, что `.env` файл создан в папке `CoffeeBackend`
- Проверьте, что все переменные окружения указаны правильно

### Ошибка: "Не удается подключиться к PostgreSQL"
- Убедитесь, что PostgreSQL запущен
- Проверьте учетные данные в `DATABASE_URL`
- Убедитесь, что база данных существует

### Ошибка при миграции: "Migration failed"
```bash
# Попробуйте очистить и пересоздать:
npx prisma migrate reset
npx prisma migrate dev
```

### Frontend не может подключиться к Backend
- Проверьте, что Backend запущен на `http://localhost:3000`
- Убедитесь, что `VITE_API_URL` указывает на правильный адрес
- Проверьте CORS настройки в Backend

## 📝 Лицензия

MIT License — используйте свободно!

---

**Версия**: 1.0.0  
**Последнее обновление**: 2026-07-03
