import { Router } from "express";
import passport from "passport";
import { authController } from "../controllers/auth.controller.js";

const router = Router();

//Registro de usuario
router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  async (req, res) => {
    res.status(201).json({ status: "success", message: "Usuario registrado" });
  }
);

router.get("/failregister", (req, res) => {
  req.logger.error("Falló el registro");
  res.status(400).json({ error: "Falló el registro" });
});

//Login de usuario
router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  async (req, res) => {
    if (!req.user) {
      return res.status(400).json("error");
    }

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
    };
    req.logger.info("Usuario logueado", req.session.user);
    res.status(200).json({ status: "success", payload: req.user });
  }
);

router.get("/faillogin", (req, res) => {
  res.status(400).json({ error: "Falló el inicio de sesión" });
});

//Login de usuario con Github
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {
    res.status(200).json({ status: "Succces", message: res });
  }
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

//Logout
router.get("/logout", authController.logoutUser);

//Enviar e-mail para restaurar la contraseña
router.post("/restore", authController.sendEmailToRestorePassword);

//Restaurar la contraseña
router.post("/restorepass/:token", authController.restorePassword);

//Current: Da la información de la sesión si esta existe
router.get("/current", authController.current);

export default router;
