import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { homePath } from "../utils/homePath";

export default function NotFoundPage() {
  const { user } = useAuth();

  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Страница не найдена</p>
      <Link className="btn" to={user ? homePath(user.role) : "/"}>
        {user ? "На главную" : "Ко входу"}
      </Link>
    </div>
  );
}
