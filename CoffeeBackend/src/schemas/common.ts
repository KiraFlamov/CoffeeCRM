import { z } from "zod";

export const idSchema = z.coerce
  .number({ error: "Некорректный id" })
  .int("Некорректный id")
  .positive("Некорректный id");

export const emailSchema = z
  .string({ error: "Введите email" })
  .trim()
  .toLowerCase()
  .pipe(z.email("Некорректный email"));

// Деньги передаются в копейках
export const moneySchema = z
  .number({ error: "Цена должна быть числом" })
  .int("Цена указывается в копейках (целое число)")
  .positive("Цена должна быть больше нуля")
  .max(100_000_000, "Слишком большая цена");
