import { api } from "./api";
import type { User } from "../types";

export const login = async (email: string, password: string) => {
  const res = await api.post<{ token: string; user: User }>("/auth/login", {
    email,
    password,
  });
  return res.data;
};
