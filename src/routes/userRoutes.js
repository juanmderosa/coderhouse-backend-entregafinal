import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { uploader } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/premium/:uid", userController.setUserRole);
router.post(
  "/:uid/documents",
  uploader.fields([
    { name: "identificacion" },
    { name: "domicilio" },
    { name: "estado_cuenta" },
    { name: "products" },
    { name: "profiles" },
  ]),
  userController.uploadFile
);

export default router;
