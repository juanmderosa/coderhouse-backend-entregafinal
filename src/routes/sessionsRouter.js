import { Router } from "express";
import userModel from "../dao/models/users.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";
const router = Router();

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  async (req, res) => {
    res.status(201).send({ status: "success", message: "Usuario registrado" });
  }
);

router.get("/failregister", async (req, res) => {
  console.log("error");
  res.send({ error: "Falló" });
});
//! MANEJO DE REGISTRO ANTERIOR
/* router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  if ((!first_name, !last_name, !email, !age, !password)) {
    throw new Error("Debés ingresar todos los campos");
  }

  const exist = await userModel.findOne({ email: email });
  if (exist) {
    return res
      .status(400)
      .send({ status: "error", error: "el correo ya existe" });
  }
  const user = {
    first_name,
    last_name,
    email,
    age,
    password: createHash(password),
    role: "usuario",
  };
  const result = await userModel.create(user);
  console.log(result);
  res.status(201).send({ status: "success", payload: result });
}); */

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  async (req, res) => {
    if (!req.user) return res.status(400).send("error");
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
    };
    res.status(200).send({ status: "success", payload: req.user });
  }
);

router.get("/faillogin", async (req, res) => {
  console.log("error");
  res.send({ error: "Fallo" });
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {
    res.send({ status: "Succces", message: res });
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

//! MANEJO DE LOGIN ANTERIOR
/* router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    const user = {
      first_name: "Admin",
      last_name: "Coder",
      email: "adminCoder@coder.com",
      age: 30,
      role: "admin",
    };

    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      role: user.role,
    };

    return res.status(200).json({
      status: "success",
      payload: req.session.user,
      message: "Inicio exitoso",
    });
  }

  // Si las credenciales no coinciden con las estáticas,
  // verificar en la base de datos normalmente
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({
      status: "error",
      error: "Credenciales inválidas",
    });
  }
  const validarPass = isValidPassword(user, password);
  if (!validarPass) {
    return res.status(401).json({
      status: "error",
      message: "Error de credenciales",
    });
  }

  // Establecer el usuario en la sesión
  req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age,
    role: user.role,
  };

  // Enviar una respuesta exitosa
  res.status(200).json({
    status: "success",
    payload: req.session.user,
    message: "Inicio exitoso",
  });

  console.log(req.session.user);
});
 */

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res.send({ status: "success", message: "Sesión cerrada" });
    } else {
      res.send({ error: err });
    }
  });
});

router.post("/restore", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return;

  const user = await userModel.findOne({ email });
  console.log(user);
  if (!user)
    return res
      .status(400)
      .send({ status: "error", message: "No se encuentra el user" });
  const newPass = createHash(password);

  await userModel.updateOne({ _id: user._id }, { $set: { password: newPass } });

  res.send({ status: "success", message: "Password actualizado" });
});

export default router;
