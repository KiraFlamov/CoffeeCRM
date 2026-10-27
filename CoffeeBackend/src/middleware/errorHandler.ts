import { ErrorRequestHandler, RequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { HttpError } from "../utils/httpError";

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ message: "Маршрут не найден" });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      message: err.issues[0]?.message ?? "Некорректные данные",
      errors: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  // Некорректный JSON в теле запроса
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({ message: "Некорректный JSON" });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
    res.status(404).json({ message: "Запись не найдена" });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Внутренняя ошибка сервера" });
};
