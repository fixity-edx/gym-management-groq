import { body } from "express-validator";

export const upsertRules = [
  body("email").isEmail().withMessage("Valid email required"),
  body("planType").isIn(["Monthly","Quarterly","Yearly"]).withMessage("Invalid planType"),
  body("trainer").trim().isLength({ min: 2 }).withMessage("Trainer required"),
  body("paymentStatus").isIn(["paid","unpaid"]).withMessage("Invalid paymentStatus"),
  body("heightCm").isNumeric().withMessage("heightCm numeric"),
  body("weightKg").isNumeric().withMessage("weightKg numeric"),
  body("goal").trim().isLength({ min: 2 }).withMessage("Goal required"),
];
