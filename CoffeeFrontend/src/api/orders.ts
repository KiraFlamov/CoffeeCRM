import { api } from "./api";
import type { Order } from "../types";

export const createOrder = async (items: { productId: number; quantity: number }[]) => {
  const res = await api.post<Order>("/orders", { items });
  return res.data;
};

export const getOrders = async () => {
  const res = await api.get<Order[]>("/orders");
  return res.data;
};
