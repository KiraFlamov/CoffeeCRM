import { Router } from "express";
import { createOrder, getOrder, getOrders } from "../controllers/orderController";
import { requireAuth } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validate";
import { createOrderSchema } from "../schemas/order";

// Доступно и кассиру, и администратору
const router = Router();

router.use(requireAuth);

router.get("/", getOrders);
router.get("/:id", getOrder);
router.post("/", validateBody(createOrderSchema), createOrder);

export default router;
