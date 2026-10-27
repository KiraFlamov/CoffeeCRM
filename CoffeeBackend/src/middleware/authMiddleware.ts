import jwt from "jsonwebtoken";
import { config } from "../config";
import { prisma } from "../prisma/client";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpError } from "../utils/httpError";

type TokenPayload = jwt.JwtPayload & { id: number };

// Проверяет JWT и подгружает актуального пользователя из БД:
// удалённый пользователь или сменённая роль применяются сразу, а не после истечения токена
export const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    throw new HttpError(401, "Требуется авторизация");
  }

  let payload: TokenPayload;

  try {
    payload = jwt.verify(token, config.JWT_SECRET) as TokenPayload;
  } catch {
    throw new HttpError(401, "Сессия недействительна или истекла, войдите снова");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    throw new HttpError(401, "Пользователь не найден");
  }

  req.user = user;
  next();
});
