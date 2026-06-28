import { Router } from "express";
import { prisma } from "../prisma/client";
import { getProducts } from "../controllers/productController";

const router = Router();

router.get("/", getProducts);

router.post("/", async (req, res) => {
  try {
    const { name, price } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        price,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ошибка при создании товара",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        message: "Товар не найден",
      });
    }

    res.json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ошибка при получении товара",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { name, price } = req.body;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        message: "Товар не найден",
      });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ошибка при обновлении товара",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        message: "Товар не найден",
      });
    }

    await prisma.product.delete({
      where: { id },
    });

    res.json({
      message: "Товар успешно удалён",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ошибка при удалении товара",
    });
  }
});

export default router;