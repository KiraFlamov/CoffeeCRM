import { Router } from "express";
import { createUser, deleteUser, getUsers } from "../controllers/userController";
import { requireAuth } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";
import { validateBody } from "../middleware/validate";
import { createUserSchema } from "../schemas/user";

const router = Router();

router.use(requireAuth, requireRole("admin"));

router.get("/", getUsers);
router.post("/", validateBody(createUserSchema), createUser);
router.delete("/:id", deleteUser);

export default router;
