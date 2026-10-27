import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { homePath } from "../utils/homePath";
import type { Role } from "../types";

export default function ProtectedRoute({
  children,
  roles,
}: {
  children: ReactNode;
  roles?: Role[];
}) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Нет доступа — отправляем на стартовую страницу своей роли
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={homePath(user.role)} replace />;
  }

  return <>{children}</>;
}
