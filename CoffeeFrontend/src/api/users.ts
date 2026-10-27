import { api } from "./api";
import type { Role, User } from "../types";

export const getUsers = async () => {
  const res = await api.get<User[]>("/users");
  return res.data;
};

export const createUser = async (data: { email: string; password: string; role: Role }) => {
  const res = await api.post<User>("/users", data);
  return res.data;
};

export const deleteUser = async (id: number) => {
  await api.delete(`/users/${id}`);
};
