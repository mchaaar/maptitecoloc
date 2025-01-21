import { Router } from "express";
import { addTask } from "../../controllers/task.controller";

const router = Router();

router.post("/addTask", addTask);

export default router;
