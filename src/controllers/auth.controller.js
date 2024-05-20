import { userService } from "../services/auth.service.js";
import { createHash, isValidPassword } from "../utils.js";

class AuthController {
  async registerUser(req, username, password, done) {
    const { first_name, last_name, email, age } = req.body;

    try {
      const user = await userService.findUserByEmail(username);
      if (user) {
        console.log("el usuario ya existe");
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
      return done(null, result);
    } catch (error) {
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
      console.log(user);
      if (!user) return done(null, false);
      const valid = isValidPassword(user, password);
      if (!valid) return done(null, false);

      return done(null, user);
    } catch (error) {
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
      return done(error);
    }
  }
}

export const authController = new AuthController();
