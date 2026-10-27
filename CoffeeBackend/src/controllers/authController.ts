import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { prisma } from "../prisma/client";
import { LoginInput } from "../schemas/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpError } from "../utils/httpError";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body as LoginInput;

  const user = await prisma.user.findUnique({ where: { email } });
  const valid = user ? await bcrypt.compare(password, user.password) : false;

  // Одинаковый ответ для «нет пользователя» и «неверный пароль»,
  // чтобы по ответу нельзя было узнать, какие email зарегистрированы
  if (!user || !valid) {
    throw new HttpError(401, "Неверный email или пароль");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
  );

  res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role },
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json(req.user);
});
