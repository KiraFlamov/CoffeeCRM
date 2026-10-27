import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

// В production пароли по умолчанию не подставляются: их нужно задать явно,
// чтобы на сервер случайно не попал аккаунт admin@test.com / test
const password = (name: string) => {
  const value = process.env[name];

  if (value) return value;

  if (process.env.NODE_ENV === "production") {
    throw new Error(`${name} не задан: в production задайте пароли аккаунтов явно`);
  }

  return "test";
};

// Тестовые аккаунты стенда (совпадают с passwords.txt).
// Для боевого запуска задайте свои значения через переменные окружения.
const users: { email: string; password: string; role: Role }[] = [
  {
    email: process.env.SEED_ADMIN_EMAIL ?? "admin@test.com",
    password: password("SEED_ADMIN_PASSWORD"),
    role: "admin",
  },
  {
    email: process.env.SEED_CASHIER_EMAIL ?? "cashier@test.com",
    password: password("SEED_CASHIER_PASSWORD"),
    role: "cashier",
  },
];

// Цены в копейках
const products = [
  { name: "Большой капучино", price: 30000 },
  { name: "Маленький капучино", price: 15000 },
  { name: "Большой латте", price: 30000 },
  { name: "Маленький латте", price: 15000 },
  { name: "Сливочный раф", price: 20000 },
];

async function main() {
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: { ...user, password: await bcrypt.hash(user.password, 10) },
    });
  }

  if ((await prisma.product.count()) === 0) {
    await prisma.product.createMany({ data: products });
  }

  console.log("Seed выполнен");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
