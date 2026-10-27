import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, me } from "../controllers/authController";
import { requireAuth } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validate";
import { loginSchema } from "../schemas/auth";

export const LOGIN_ATTEMPTS = 10;

// Защита от перебора паролей: считаются только неудачные попытки с одного IP,
// поэтому обычные пользователи в лимит не упираются
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: LOGIN_ATTEMPTS,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Слишком много попыток входа, попробуйте через 15 минут" },
});

// Публичной регистрации нет: пользователей создаёт администратор
const router = Router();

router.post("/login", loginLimiter, validateBody(loginSchema), login);
router.get("/me", requireAuth, me);

export default router;
