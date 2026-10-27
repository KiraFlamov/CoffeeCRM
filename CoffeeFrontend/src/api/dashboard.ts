import { api } from "./api";
import type { DashboardData } from "../types";

export const getDashboard = async () => {
  const res = await api.get<DashboardData>("/dashboard");
  return res.data;
};
