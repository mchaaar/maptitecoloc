import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { addTask } from "../../controllers/task.controller";

const router = Router();

router.post("/addTask", authMiddleware, addTask);

export default router;