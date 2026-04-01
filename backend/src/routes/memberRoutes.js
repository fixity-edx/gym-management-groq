import { Router } from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { upsertRules } from "../validators/memberValidators.js";
import { getMe, listAll, upsertMember } from "../controllers/memberController.js";

const router = Router();

router.get("/me", protect, getMe);
router.get("/", protect, requireRole("admin"), listAll);

router.post("/", protect, requireRole("admin"), upsertRules, validate, upsertMember);

export default router;
