import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";
import { setUnauthorizedHandler, tokenStorage } from "../api/api";
import type { Role, User } from "../types";

type JwtPayload = {
  id: number;
  email: string;
  role: Role;
  exp?: number;
};

type Session = { token: string; user: User; expiresAt: number | null };

const toSession = (token: string): Session | null => {
  try {
    const payload = jwtDecode<JwtPayload>(token);
    const expiresAt = payload.exp ? payload.exp * 1000 : null;

    if (expiresAt !== null && expiresAt <= Date.now()) {
      return null;
    }

    return {
      token,
      user: { id: payload.id, email: payload.email, role: payload.role },
      expiresAt,
    };
  } catch {
    return null;
  }
};

// Восстанавливаем сессию из localStorage; просроченный или битый токен сразу удаляем
const restoreSession = (): Session | null => {
  const token = tokenStorage.get();
  const session = token ? toSession(token) : null;

  if (!session) {
    tokenStorage.clear();
  }

  return session;
};

const MAX_TIMEOUT = 2 ** 31 - 1;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(restoreSession);

  const login = useCallback((token: string, user: User) => {
    tokenStorage.set(token);
    setSession({ token, user, expiresAt: toSession(token)?.expiresAt ?? null });
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setSession(null);
  }, []);

  // Сервер ответил 401 (токен истёк, пользователь удалён) — выходим
  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  // Автоматический выход в момент истечения токена
  useEffect(() => {
    if (!session?.expiresAt) return;

    const timer = setTimeout(logout, Math.min(session.expiresAt - Date.now(), MAX_TIMEOUT));
    return () => clearTimeout(timer);
  }, [session, logout]);

  const value = useMemo(
    () => ({
      token: session?.token ?? null,
      user: session?.user ?? null,
      login,
      logout,
    }),
    [session, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
