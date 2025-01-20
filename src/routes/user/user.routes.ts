import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshToken,
  getMe,
  deleteUser,
} from "../../controllers/user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.get("/getMe", authMiddleware, getMe);
router.delete("/delete", authMiddleware, deleteUser);

export default router;
