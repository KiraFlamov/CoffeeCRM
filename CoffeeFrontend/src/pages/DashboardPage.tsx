import { useEffect, useState } from "react";
import { getDashboard } from "../api/dashboard";
import { getErrorMessage } from "../utils/errors";
import { formatMoney } from "../utils/money";
import type { DashboardData } from "../types";
import "../style/DashboardPage.css";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((err) => setError(getErrorMessage(err, "Ошибка загрузки дашборда")));
  }, []);

  if (error) return <div className="form-error">{error}</div>;
  if (!data) return <h2>Загрузка...</h2>;

  return (
    <div className="dashboard">
      <h1>Дашборд</h1>

      <div className="dashboard-cards">
        <Card title="Товары" value={data.products} />
        <Card title="Заказы" value={data.orders} />
        <Card title="Выручка" value={formatMoney(data.revenue)} />
        <Card title="Средний чек" value={formatMoney(data.averageCheck)} />
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
}
