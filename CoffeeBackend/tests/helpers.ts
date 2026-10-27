import bcrypt from "bcrypt";
import request from "supertest";
import { Role } from "@prisma/client";
import { createApp } from "../src/app";
import { prisma } from "../src/prisma/client";

export const app = createApp();

export const PASSWORD = "secret-password";

export const resetDatabase = async () => {
  await prisma.$executeRaw`TRUNCATE "OrderItem", "Order", "Product", "User" RESTART IDENTITY CASCADE`;
};

export const createUser = async (role: Role, email = `${role}@test.com`) => {
  // Минимальная стоимость bcrypt, чтобы тесты не тормозили
  const password = await bcrypt.hash(PASSWORD, 4);
  return prisma.user.create({ data: { email, password, role } });
};

// Создаёт пользователя и входит через API, как это делает фронтенд
export const loginAs = async (role: Role, email?: string) => {
  const user = await createUser(role, email);
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: user.email, password: PASSWORD })
    .expect(200);

  return { user, token: res.body.token as string };
};

export const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });

export const createProduct = (name: string, price: number, isActive = true) =>
  prisma.product.create({ data: { name, price, isActive } });

export const placeOrder = (token: string, items: { productId: number; quantity: number }[]) =>
  request(app).post("/api/orders").set(bearer(token)).send({ items });
