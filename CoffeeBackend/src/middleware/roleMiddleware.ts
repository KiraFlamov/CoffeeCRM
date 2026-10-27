import { RequestHandler } from "express";
import { Role } from "@prisma/client";
import { HttpError } from "../utils/httpError";

export const requireRole =
  (...roles: Role[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) {
      next(new HttpError(401, "Требуется авторизация"));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new HttpError(403, "Недостаточно прав"));
      return;
    }

    next();
  };
