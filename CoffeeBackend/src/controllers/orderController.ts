import { prisma } from "../prisma/client";
import { idSchema } from "../schemas/common";
import { CreateOrderInput } from "../schemas/order";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpError } from "../utils/httpError";

const orderInclude = {
  items: { orderBy: { id: "asc" } },
} as const;

export const getOrders = asyncHandler(async (_req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    include: orderInclude,
  });

  res.json(orders);
});

export const getOrder = asyncHandler(async (req, res) => {
  const id = idSchema.parse(req.params.id);
  const order = await prisma.order.findUnique({ where: { id }, include: orderInclude });

  if (!order) {
    throw new HttpError(404, "Заказ не найден");
  }

  res.json(order);
});

export const createOrder = asyncHandler(async (req, res) => {
  const { items } = req.body as CreateOrderInput;

  // Объединяем повторяющиеся позиции одного товара
  const quantities = new Map<number, number>();
  for (const item of items) {
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  }
  const productIds = [...quantities.keys()];

  const order = await prisma.$transaction(async (tx) => {
    // Один запрос вместо запроса на каждую позицию
    const products = await tx.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      const found = new Set(products.map((product) => product.id));
      const missing = productIds.filter((id) => !found.has(id));
      throw new HttpError(400, `Товары не найдены или сняты с продажи: ${missing.join(", ")}`);
    }

    // Цена берётся из БД, а не от клиента; название и цена сохраняются в заказе
    const lines = products.map((product) => ({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantities.get(product.id)!,
    }));

    const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);

    return tx.order.create({
      data: { total, items: { create: lines } },
      include: orderInclude,
    });
  });

  res.status(201).json(order);
});
