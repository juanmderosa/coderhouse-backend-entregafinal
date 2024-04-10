import { Router } from "express";
import userModel from "../dao/models/users.js";
import { createHash, isValidPassword } from "../utils.js";
const router = Router();

router.post("/register", async (req, res) => {
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
});

router.post("/login", async (req, res) => {
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

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res.send({ status: "success", message: "Sesión cerrada" });
    } else {
      res.send({ error: err });
    }
  });
});

export default router;
