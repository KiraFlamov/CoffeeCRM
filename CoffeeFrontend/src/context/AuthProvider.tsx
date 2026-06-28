import { ReactNode, useState } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [role, setRole] = useState<string | null>(
    localStorage.getItem("role")
  );

  const login = (token: string, role: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    setToken(token);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}