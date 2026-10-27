import { useEffect, useState } from "react";
import { getOrders } from "../api/orders";
import { getErrorMessage } from "../utils/errors";
import { formatMoney } from "../utils/money";
import type { Order } from "../types";
import "../style/OrdersPage.css";

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  dateStyle: "short",
  timeStyle: "medium",
});

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch((err) => setError(getErrorMessage(err, "Ошибка загрузки заказов")));
  }, []);

  if (error) return <div className="form-error">{error}</div>;
  if (!orders) return <h2>Загрузка...</h2>;

  return (
    <div className="orders-page">
      <h1>История заказов</h1>

      {orders.length === 0 && <p className="muted">Заказов пока нет</p>}

      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <h3>Заказ #{order.id}</h3>

          <p>{dateFormatter.format(new Date(order.createdAt))}</p>

          {/* Название и цена — на момент продажи */}
          {order.items.map((item) => (
            <div key={item.id} className="order-line">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatMoney(item.price * item.quantity)}</span>
            </div>
          ))}

          <hr />

          <strong>Итого: {formatMoney(order.total)}</strong>
        </div>
      ))}
    </div>
  );
}
