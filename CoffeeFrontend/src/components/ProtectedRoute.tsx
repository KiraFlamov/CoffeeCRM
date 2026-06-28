import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import NotFoundPage from "../pages/NotFoundPage";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: string;
}) {
  const { token, role: userRole } = useAuth();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role) {
    const hasAccess =
      userRole === role ||
      userRole === "admin";

    if (!hasAccess) {
      return <NotFoundPage />;
    }
  }

  return <>{children}</>;
}