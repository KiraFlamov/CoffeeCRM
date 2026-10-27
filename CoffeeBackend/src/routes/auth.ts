import { Router } from "express";
import { login, me } from "../controllers/authController";
import { requireAuth } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validate";
import { loginSchema } from "../schemas/auth";

// Публичной регистрации нет: пользователей создаёт администратор
const router = Router();

router.post("/login", validateBody(loginSchema), login);
router.get("/me", requireAuth, me);

export default router;
