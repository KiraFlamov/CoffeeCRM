import type { Role } from "../types";

// Стартовая страница после входа
export const homePath = (role: Role) => (role === "admin" ? "/dashboard" : "/pos");
