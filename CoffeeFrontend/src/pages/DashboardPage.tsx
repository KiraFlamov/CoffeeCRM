import { useEffect, useState } from "react";
import { getDashboard } from "../api/dashboard";

type DashboardData = {
  products: number;
  orders: number;
  revenue: number;
  averageCheck: number;
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getDashboard();
        setData(result);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <h2>Загрузка...</h2>;

  if (!data) return <h2>Ошибка загрузки</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <div style={{ display: "flex", gap: 20 }}>
        <Card title="Товары" value={data.products} />
        <Card title="Заказы" value={data.orders} />
        <Card title="Выручка" value={`${data.revenue} ₽`} />
        <Card title="Средний чек" value={`${data.averageCheck} ₽`} />
      </div>
    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div
      style={{
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 10,
        minWidth: 150,
      }}
    >
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
}