import { Router } from "express";
import { prisma } from "../prisma/client";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { items } = req.body;

    let total = 0;

    // считаем сумму
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return res.status(404).json({
          message: `Товар ${item.productId} не найден`,
        });
      }

      total += product.price * item.quantity;
    }

    // создаём заказ
    const order = await prisma.order.create({
      data: {
        total,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ошибка при создании заказа",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json(orders);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ошибка при получении заказов",
    });
  }
});

export default router;