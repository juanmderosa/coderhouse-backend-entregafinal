import { Router } from "express";
import { createHash } from "../utils.js";
import passport from "passport";
import { usersRepository } from "../repositories/index.js";
import CurrentDTO from "../dao/DTOs/currentDTO.js";
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
  console.error("Falló el registro");
  res.status(400).json({ error: "Falló el registro" });
});

//Login de usuario
router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  async (req, res) => {
    if (!req.user) return res.status(400).json("error");
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
    };
    res.status(200).json({ status: "success", payload: req.user });
  }
);

router.get("/faillogin", (req, res) => {
  console.error("Falló el inicio de sesión");
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
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res.status(200).json({ status: "success", message: "Sesión cerrada" });
    } else {
      res.status(500).json({ error: err });
    }
  });
});

//Restaurar contraseña
router.post("/restore", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return;

  const user = await usersRepository.findUserByEmail(email);
  console.log(user);
  if (!user)
    return res
      .status(400)
      .json({ status: "error", message: "No se encuentra el user" });
  const newPass = createHash(password);
  const passwordToUpdate = { password: newPass };

  await usersRepository.updateUser(user, passwordToUpdate);

  res.status(200).json({ status: "success", message: "Password actualizado" });
});

//Current: Da la información de la sesión si esta existe
router.get("/current", async (req, res) => {
  if (!req.user) {
    res.status(403).json({ status: "Error", message: "No user authenticated" });
  }
  const currentUser = new CurrentDTO(req.user);

  res.status(200).json({
    status: "success",
    payload: currentUser,
  });
});

export default router;
