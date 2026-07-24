# CoffeeCRM

**Full-stack приложение для управления кофейней (POS система)** с авторизацией, разграничением ролей и управлением товарами и заказами.

##  Содержание
- [Скриншоты](#скриншоты)
- [Возможности](#возможности)
- [Технологии](#технологии)
- [Установка](#установка)
- [Запуск](#запуск)
- [Структура проекта](#структура-проекта)
- [Переменные окружения](#переменные-окружения)
- [API Endpoints](#api-endpoints)
- [Роли и разрешения](#роли-и-разрешения)
- [Дальнейшие улучшения](#дальнейшие-улучшения)
- [Лицензия](#лицензия)


## Скриншоты

### Логин

<img src="screenshots/login.png" width="700"/>

### Товары

<img src="screenshots/products.png" width="700"/>

### POS

<img src="screenshots/pos.png" width="700"/>

### Заказы

<img src="screenshots/orders.png" width="700"/>

### Пользователи

<img src="screenshots/users.png" width="700"/>

### Дашборд

<img src="screenshots/dashboard.png" width="700"/>

## Возможности

-  **JWT-авторизация** — безопасная аутентификация пользователей
-  **Разграничение ролей** — Администратор и Кассир с разными правами
-  **Управление товарами** — добавление, редактирование, удаление товаров
-  **POS система** — быстрое создание заказов
-  **История заказов** — просмотр всех заказов с фильтрацией
-  **Управление пользователями** — создание и управление учетными записями
-  **Защищённые маршруты** — контроль доступа на уровне UI и API
-  **Адаптивный дизайн** — удобно работает на разных устройствах

##  Технологии

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


##  Установка

### 1. Клонирование репозитория

```bash
git clone https://github.com/KiraFlamov/CoffeeCRM.git
cd "CoffeeCRM"
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

##  Запуск

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

##  Структура проекта

```
CoffeeCRM/
├── CoffeeBackend/
│   ├── src/
│   │   ├── index.ts              # Входная точка
│   │   ├── controllers/          # Обработчики запросов
│   │   ├── middleware/           # Промежуточные обработчики Express
│   │   ├── routes/               # API маршруты
│   │   └── prisma/
│   │       └── client.ts         # Prisma клиент
│   ├── prisma/
│   │   ├── schema.prisma         # схема БД
│   │   └── migrations/           # Миграции
│   ├── package.json              # Зависимости проекта и npm-скрипты
│   └── tsconfig.json             # Конфигурация TypeScript
│
├── CoffeeFrontend/
│   ├── src/
│   │   ├── pages/                # Страницы приложения
│   │   ├── components/           # Переиспользуемые компоненты
│   │   ├── api/                  # API запросы
│   │   ├── context/              # Контекст авторизации (Auth)
│   │   ├── layout/               # Основной Layout (обертка страниц)
│   │   └── style/                # CSS файлы
│   ├── package.json              # Зависимости проекта и npm-скрипты
│   └── vite.config.ts            # Конфигурация Vite (сборка проекта)
│
└── README.md
└── screenshots/
```

##  Переменные окружения

### Backend (.env)

```env
# База данных
DATABASE_URL="postgresql://user:password@localhost:5432/coffee_crm"

# JWT
JWT_SECRET="your-secret-key"

# Сервер
PORT=3000
```

### Frontend (.env)

```env
VITE_API_URL="http://localhost:3000"
```

##  API Endpoints

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

##  Роли и разрешения

| Функция | Администратор | Кассир |
|---------|:-------------:|:------:|
| Вход в систему | ✅ | ✅ |
| Просмотр товаров | ✅ | ✅ |
| Управление товарами | ✅ | ❌ |
| Создание заказов | ✅ | ✅ |
| Просмотр заказов | ✅ | ✅ |
| Управление пользователями | ✅ | ❌ |
| Доступ к панели администратора | ✅ | ❌ |

##  Дальнейшие улучшения

- [ ] Поиск товаров (Search products)
- [ ] Пагинация в списках товаров и заказов
- [ ] Редактирование уже созданных заказов
- [ ] Фильтрация и аналитика продаж (по дате, сумме, кассиру)
- [ ] Валидация данных на фронтенде и бэкенде
- [ ] Покрытие основных API тестами (unit/integration tests)
- [ ] Улучшение безопасности (refresh tokens, защита JWT)
- [ ] Docker-контейнеризация проекта
- [ ] Настройка CI/CD (GitHub Actions)
- [ ] Рефакторинг архитектуры (улучшение слоёв API)


---

## Лицензия

Проект распространяется под лицензией MIT. Подробнее — в файле [LICENSE](LICENSE).
