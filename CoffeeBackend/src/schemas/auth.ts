import { z } from "zod";
import { emailSchema } from "./common";

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string({ error: "Введите пароль" }).min(1, "Введите пароль"),
});

export type LoginInput = z.infer<typeof loginSchema>;
