import { z } from "zod";
import { moneySchema } from "./common";

const nameSchema = z
  .string({ error: "Введите название товара" })
  .trim()
  .min(1, "Введите название товара")
  .max(100, "Название не длиннее 100 символов");

export const createProductSchema = z.object({
  name: nameSchema,
  price: moneySchema,
});

export const updateProductSchema = z
  .object({
    name: nameSchema.optional(),
    price: moneySchema.optional(),
  })
  .refine((data) => data.name !== undefined || data.price !== undefined, {
    message: "Нечего обновлять",
  });

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
