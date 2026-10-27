import { RequestHandler } from "express";
import { ZodType } from "zod";

// Проверяет и нормализует тело запроса по zod-схеме
export const validateBody =
  (schema: ZodType): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(result.error);
      return;
    }

    req.body = result.data;
    next();
  };
