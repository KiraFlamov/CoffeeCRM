import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/");
  };

  return (
    <aside
      style={{
        width: "220px",
        background: "#1f2937",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2>CoffeeCRM</h2>

      <p>Role: {role}</p>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginTop: "20px",
        }}
      >
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

      <button
        onClick={logout}
        style={{
          marginTop: "auto",
          padding: "10px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </aside>
  );
}