import { useEffect, useState } from "react";
import { getOrders } from "../api/orders";
import "../style/OrdersPage.css";

type Order = {
  id: number;
  total: number;
  createdAt: string;
  items: {
    quantity: number;
    product: {
      id: number;
      name: string;
      price: number;
    };
  }[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="orders-page">
      <h1>История заказов</h1>

      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <h3>Заказ #{order.id}</h3>

          <p>{new Date(order.createdAt).toLocaleString()}</p>

          {order.items.map((item, index) => (
            <div key={index}>
              {item.product.name} × {item.quantity}
            </div>
          ))}

          <hr />

          <strong>Итого: {order.total} ₽</strong>
        </div>
      ))}
    </div>
  );
}