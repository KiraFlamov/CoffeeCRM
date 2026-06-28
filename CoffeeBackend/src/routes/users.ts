import { Router } from "express";
import { prisma } from "../prisma/client";

import bcrypt from "bcrypt";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    res.json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ошибка получения пользователей",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email и пароль обязательны",
      });
    }

    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return res.status(400).json({
        message: "Пользователь уже существует",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
        role,
      },
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ошибка создания пользователя",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        message: "Администратора удалять нельзя",
      });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.json({
      message: "Пользователь удалён",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ошибка удаления пользователя",
    });
  }
});

export default router;