import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

const TOKEN_KEY = "token";

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    // Роль раньше хранилась отдельно — чистим старый ключ
    localStorage.removeItem("role");
  },
};

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let unauthorizedHandler: (() => void) | null = null;

// AuthProvider подписывается сюда, чтобы разлогинить пользователя при 401
export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  unauthorizedHandler = handler;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error?.config?.url?.includes("/auth/login");

    if (axios.isAxiosError(error) && error.response?.status === 401 && !isLoginRequest) {
      unauthorizedHandler?.();
    }

    return Promise.reject(error);
  }
);
