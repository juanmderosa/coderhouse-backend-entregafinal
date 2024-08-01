import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { uploader } from "../middlewares/multer.middleware.js";
import { adminViewAuth, authorization } from "../middlewares/auth.js";

const router = Router();

router.get("/", authorization(["admin"]), userController.getAllUsers);
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
router.delete("/:uid", adminViewAuth, userController.deleteUser);
router.delete(
  "/",
  authorization(["admin"]),
  userController.deleteUsersWithoutActivity
);

export default router;
