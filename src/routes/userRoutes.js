import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";

const router = Router();

router.post("/premium/:uid", authController.setUserRole);

export default router;
