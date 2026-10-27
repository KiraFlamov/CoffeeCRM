import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "../style/LoginPage.css";

import { login as loginRequest } from "../api/auth";
import { useAuth } from "../context/useAuth";
import { getErrorMessage } from "../utils/errors";
import { homePath } from "../utils/homePath";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Уже вошли — сразу на рабочую страницу
  if (user) {
    return <Navigate to={homePath(user.role)} replace />;
  }

  const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const { token, user } = await loginRequest(email, password);
      login(token, user);
      navigate(homePath(user.role), { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Не удалось войти"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper">
      <h1>CoffeeCRM</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Пароль"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Вход..." : "Войти"}
        </button>
      </form>

      {error && <p className="login-error">{error}</p>}
    </div>
  );
}
