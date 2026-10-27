export type Role = "admin" | "cashier";

export interface User {
  id: number;
  email: string;
  role: Role;
}

// Все суммы приходят с сервера в копейках
export interface Product {
  id: number;
  name: string;
  price: number;
  isActive: boolean;
}

export interface OrderItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export interface DashboardData {
  products: number;
  orders: number;
  revenue: number;
  averageCheck: number;
}
