import { prisma } from "../prisma/client";
import { idSchema } from "../schemas/common";
import { CreateProductInput, UpdateProductInput } from "../schemas/product";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpError } from "../utils/httpError";

const findActiveProduct = async (id: number) => {
  const product = await prisma.product.findFirst({ where: { id, isActive: true } });

  if (!product) {
    throw new HttpError(404, "Товар не найден");
  }

  return product;
};

export const getProducts = asyncHandler(async (_req, res) => {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { id: "asc" },
  });

  res.json(products);
});

export const getProduct = asyncHandler(async (req, res) => {
  const id = idSchema.parse(req.params.id);
  res.json(await findActiveProduct(id));
});

export const createProduct = asyncHandler(async (req, res) => {
  const data = req.body as CreateProductInput;
  const product = await prisma.product.create({ data });

  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const id = idSchema.parse(req.params.id);
  const data = req.body as UpdateProductInput;

  await findActiveProduct(id);

  // Старые заказы не меняются: в них сохранены название и цена на момент продажи
  const product = await prisma.product.update({ where: { id }, data });

  res.json(product);
});

// Мягкое удаление: товар пропадает из каталога и кассы, но история заказов остаётся целой
export const deleteProduct = asyncHandler(async (req, res) => {
  const id = idSchema.parse(req.params.id);

  await findActiveProduct(id);
  await prisma.product.update({ where: { id }, data: { isActive: false } });

  res.status(204).end();
});
