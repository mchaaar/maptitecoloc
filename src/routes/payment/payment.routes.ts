import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  createPayment,
  listPaymentsForColocation,
} from "../../controllers/payment.controller";

const router = Router();

router.post("/", authMiddleware, createPayment);

router.get("/:colocationId", authMiddleware, listPaymentsForColocation);

export default router;