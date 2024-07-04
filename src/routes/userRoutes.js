import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";

const router = Router();

router.post("/premium/:uid", authController.setUserRole);
router.delete("/:uid", authController.deleteUser);

export default router;
