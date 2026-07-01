import { NavLink, useNavigate } from "react-router-dom";
import "../style/Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/");
  };

  return (
    <aside className="sidebar">
      <h2>CoffeeCRM</h2>

      <p>Role: {role}</p>

      <nav className="sidebar-nav">
        {role === "admin" && (
          <>
            <NavLink to="/dashboard">Дашборд</NavLink>

            <NavLink to="/products">Товары</NavLink>

            <NavLink to="/users">Пользователи</NavLink>
          </>
        )}

      <NavLink to="/orders">Заказы</NavLink>
      
      <NavLink to="/pos">Касса</NavLink>
        
      </nav>

      <button onClick={logout} className="logout-btn">
        Выйти
      </button>
    </aside>
  );
}