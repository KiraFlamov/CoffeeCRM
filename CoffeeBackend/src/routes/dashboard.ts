import { Router } from "express";
import { prisma } from "../prisma/client";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = Router();

router.get("/", authMiddleware, roleMiddleware(["admin"]),async (req, res) => {
  try {
    // все товары
    const productsCount = await prisma.product.count();

    // все заказы
    const orders = await prisma.order.findMany();

    const ordersCount = orders.length;

    // общая выручка
    const revenue = orders.reduce((sum: number, order: any) => {
    return sum + order.total;
    }, 0);

    // средний чек
    const averageCheck =
      ordersCount === 0 ? 0 : revenue / ordersCount;

    res.json({
      products: productsCount,
      orders: ordersCount,
      revenue,
      averageCheck,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ошибка при получении dashboard",
    });
  }
});

export default router;