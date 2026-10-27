import { prisma } from "../prisma/client";
import { asyncHandler } from "../utils/asyncHandler";

export const getDashboard = asyncHandler(async (_req, res) => {
  // Считаем на стороне БД, а не загружаем все заказы в память
  const [products, orderStats] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.aggregate({
      _count: { _all: true },
      _sum: { total: true },
    }),
  ]);

  const orders = orderStats._count._all;
  const revenue = orderStats._sum.total ?? 0;

  res.json({
    products,
    orders,
    revenue,
    averageCheck: orders === 0 ? 0 : Math.round(revenue / orders),
  });
});
