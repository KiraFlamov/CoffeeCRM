import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../style/LoginPage.css";

import { api } from "../api/api";
import { useAuth } from "../context/useAuth";

type JwtPayload = {
  role: "admin" | "cashier" | string;
  email?: string;
  exp?: number;
  iat?: number;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const decoded = jwtDecode<JwtPayload>(response.data.token);

      login(response.data.token, decoded.role);

      if (decoded.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/pos");
      }
    } catch {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div className="login-wrapper">
      <h1>CoffeeCRM</h1>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Войти</button>
      </form>

      {error && <p className="login-error">{error}</p>}
    </div>
  );
}