import { z } from "zod";
import { idSchema } from "./common";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: idSchema,
        quantity: z
          .number({ error: "Количество должно быть числом" })
          .int("Количество должно быть целым")
          .min(1, "Количество должно быть не меньше 1")
          .max(100, "Слишком большое количество"),
      }),
      { error: "Передайте позиции заказа" }
    )
    .min(1, "Заказ не может быть пустым")
    .max(50, "Слишком много позиций в заказе"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
