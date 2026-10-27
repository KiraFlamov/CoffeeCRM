import { api } from "./api";
import type { Product } from "../types";

// price — в копейках
type ProductInput = { name: string; price: number };

export const getProducts = async () => {
  const res = await api.get<Product[]>("/products");
  return res.data;
};

export const createProduct = async (data: ProductInput) => {
  const res = await api.post<Product>("/products", data);
  return res.data;
};

export const updateProduct = async (id: number, data: Partial<ProductInput>) => {
  const res = await api.put<Product>(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id: number) => {
  await api.delete(`/products/${id}`);
};
