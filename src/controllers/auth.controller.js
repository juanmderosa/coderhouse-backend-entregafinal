import { userService } from "../services/auth.service.js";
import { logger } from "../utils/Logger.js";
import { createHash, isValidPassword } from "../utils/utils.js";

class AuthController {
  async registerUser(req, username, password, done) {
    const { first_name, last_name, email, age } = req.body;

    try {
      const user = await userService.findUserByEmail(username);
      if (user) {
        logger.warning("El usuario ya existe");
        return done(null, false);
      }

      const newUser = {
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
        role: "usuario",
      };

      let result = await userService.createUser(newUser);
      logger.info("Usuario creado correctamente", newUser);
      return done(null, result);
    } catch (error) {
      logger.error(error);
      return done(error);
    }
  }

  async loginUser(username, password, done) {
    try {
      if (username === "adminCoder@coder.com" && password === "adminCod3r123") {
        // Si las credenciales coinciden con el administrador predefinido creo un objeto con el los datos del administrador.
        const adminUser = {
          first_name: "Admin",
          last_name: "Coder",
          email: "adminCoder@coder.com",
          age: 30,
          role: "admin",
        };
        return done(null, adminUser);
      }

      const user = await userService.findUserByEmail(username);

      if (!user) {
        logger.fatal("Usuario no encontrado");
        return done(null, false);
      }
      const valid = isValidPassword(user, password);
      if (!valid) return done(null, false);

      return done(null, user);
    } catch (error) {
      logger.error("Usuario no encontrado", error);
      return done(error);
    }
  }

  async githubAuth(accessToken, refreshToken, profile, done) {
    try {
      const user = await userService.findUserByEmail(profile._json.email);
      //si no existe lo creamos
      if (!user) {
        const newUser = {
          first_name: profile._json.name,
          last_name: "",
          age: 20,
          email: profile._json.email,
          password: "",
          role: "usuario",
        };
        //guardamos el usuario en la database
        let createdUser = await userService.createUser(newUser);
        done(null, createdUser);
      } else {
        done(null, user);
      }
    } catch (error) {
      logger.error("Usuario no encontrado", error);
      return done(error);
    }
  }

  async setUserRole(req, res) {
    const { uid } = req.params;
    console.log(uid);
    const user = await userService.findUserById(uid);
    console.log(user);

    if (user.role === "admin") {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Los admins no pueden cambiar su rol",
        });
    }

    let newRole = null;
    if (user.role === "premium") {
      newRole = { role: "usuario" };
    } else if (user.role === "usuario") {
      newRole = { role: "premium" };
    } else {
      return res
        .status(400)
        .json({ status: "error", message: "Rol no válido" });
    }

    try {
      await userService.updateUser(user, newRole);
      res.send({ status: "success", message: "Se ha actualizado el rol" });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Error actualizando el rol" });
    }
  }
}

export const authController = new AuthController();
