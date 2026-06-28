import { api } from "./api";

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const deleteUser = async (id: number) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

export const createUser = async (data: {
  email: string;
  password: string;
  role: string;
}) => {
  const res = await api.post("/users", data);
  return res.data;
};