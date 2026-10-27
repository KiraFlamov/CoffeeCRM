import { Router } from "express";
import { getDashboard } from "../controllers/dashboardController";
import { requireAuth } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";

const router = Router();

router.get("/", requireAuth, requireRole("admin"), getDashboard);

export default router;
