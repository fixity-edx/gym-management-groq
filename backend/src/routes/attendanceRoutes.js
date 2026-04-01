import { Router } from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { logAttendance } from "../controllers/attendanceController.js";

const router = Router();

router.post("/log", protect, requireRole("user","admin"), logAttendance);

export default router;
