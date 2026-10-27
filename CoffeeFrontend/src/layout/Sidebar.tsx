import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../style/Sidebar.css";

const roleLabels = {
  admin: "Администратор",
  cashier: "Кассир",
} as const;

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  if (!user) return null;

  return (
    <aside className="sidebar">
      <h2>CoffeeCRM</h2>

      <div className="sidebar-user">
        <p className="sidebar-email">{user.email}</p>
        <p>{roleLabels[user.role]}</p>
      </div>

      <nav className="sidebar-nav">
        {user.role === "admin" && (
          <>
            <NavLink to="/dashboard">Дашборд</NavLink>
            <NavLink to="/products">Товары</NavLink>
            <NavLink to="/users">Пользователи</NavLink>
          </>
        )}

        <NavLink to="/orders">Заказы</NavLink>
        <NavLink to="/pos">Касса</NavLink>
      </nav>

      <button onClick={handleLogout} className="logout-btn">
        Выйти
      </button>
    </aside>
  );
}
