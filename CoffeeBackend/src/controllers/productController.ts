import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export const getProducts = async (
  req: Request,
  res: Response
) => {
  try {
    const products = await prisma.product.findMany();

    res.json(products);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ошибка при получении товаров",
    });
  }
};