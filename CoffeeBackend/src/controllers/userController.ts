import bcrypt from "bcrypt";
import { prisma } from "../prisma/client";
import { idSchema } from "../schemas/common";
import { CreateUserInput } from "../schemas/user";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpError } from "../utils/httpError";

const publicUser = { id: true, email: true, role: true } as const;

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await prisma.user.findMany({
    select: publicUser,
    orderBy: { id: "asc" },
  });

  res.json(users);
});

export const createUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body as CreateUserInput;

  const exists = await prisma.user.findUnique({ where: { email } });

  if (exists) {
    throw new HttpError(409, "Пользователь с таким email уже существует");
  }

  const user = await prisma.user.create({
    data: { email, role, password: await bcrypt.hash(password, 10) },
    select: publicUser,
  });

  res.status(201).json(user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const id = idSchema.parse(req.params.id);

  if (id === req.user?.id) {
    throw new HttpError(400, "Нельзя удалить самого себя");
  }

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new HttpError(404, "Пользователь не найден");
  }

  if (user.role === "admin") {
    throw new HttpError(400, "Администратора удалять нельзя");
  }

  await prisma.user.delete({ where: { id } });

  res.status(204).end();
});
