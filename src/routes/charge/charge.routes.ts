import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  createCharge,
  listChargesForColocation,
  softDeleteCharge,
} from "../../controllers/charge.controller";

const router = Router();

router.post("/", authMiddleware, createCharge);

router.get("/:colocationId", authMiddleware, listChargesForColocation);

router.delete("/", authMiddleware, softDeleteCharge);

export default router;