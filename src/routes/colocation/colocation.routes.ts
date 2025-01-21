import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  createColocation,
  listUserColocations,
  getColocationDetails,
  deleteColocation,
  addMemberToColocation,
  removeMemberFromColocation,
  transferOwnership,
} from "../../controllers/colocation.controller";

const router = Router();

router.get("/", authMiddleware, listUserColocations);
router.post("/register", createColocation);
router.get("/:id", authMiddleware, getColocationDetails);
router.delete("/:id", authMiddleware, deleteColocation);

router.post("/addMember", authMiddleware, addMemberToColocation);
router.post("/removeMember", authMiddleware, removeMemberFromColocation);
router.post("/transferOwnership", authMiddleware, transferOwnership);

export default router;
