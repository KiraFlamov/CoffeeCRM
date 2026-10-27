import { z } from "zod";
import { emailSchema } from "./common";

export const createUserSchema = z.object({
  email: emailSchema,
  password: z
    .string({ error: "Введите пароль" })
    .min(4, "Пароль должен быть не короче 4 символов")
    .max(72, "Пароль слишком длинный"),
  role: z.enum(["admin", "cashier"], { error: "Роль: admin или cashier" }).default("cashier"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
