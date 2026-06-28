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
            <NavLink to="/dashboard">Dashboard</NavLink>

            <NavLink to="/products">Products</NavLink>

            <NavLink to="/users">Users</NavLink>
          </>
        )}

      <NavLink to="/orders">Orders</NavLink>
      
      <NavLink to="/pos">POS</NavLink>
        
      </nav>

      <button onClick={logout} className="logout-btn">
        Logout
      </button>
    </aside>
  );
}