import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/client";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

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
      },
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({
      message: "Ошибка регистрации",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({
        message: "Неверный пароль",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({
      message: "Ошибка входа",
    });
  }
};