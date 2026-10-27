import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/productController";
import { requireAuth } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";
import { validateBody } from "../middleware/validate";
import { createProductSchema, updateProductSchema } from "../schemas/product";

const router = Router();

router.use(requireAuth);

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", requireRole("admin"), validateBody(createProductSchema), createProduct);
router.put("/:id", requireRole("admin"), validateBody(updateProductSchema), updateProduct);
router.delete("/:id", requireRole("admin"), deleteProduct);

export default router;
