import { api } from "./api";

export const createOrder = async (items: {
  productId: number;
  quantity: number;
}[]) => {
  const res = await api.post("/orders", { items });
  return res.data;
};

export const getOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};