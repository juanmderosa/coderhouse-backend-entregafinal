import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { enviroment } from "./config.js";
import { userService } from "../services/auth.service.js";
import { authController } from "../controllers/auth.controller.js";
import jwt, { ExtractJwt } from "passport-jwt";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[enviroment.jwt.COOKIE];
  }
  return token;
};

const initializePassport = () => {
  //Registrar ususario loclamente
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      (req, username, password, done) => {
        authController.registerUser(req, username, password, done);
      }
    )
  );

  //estrategia local para iniciar sesión
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        authController.loginUser(username, password, done);
      }
    )
  );

  //Estrategia para iniciar sesión con github
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: enviroment.githubClientID, //id de la app en github
        clientSecret: enviroment.githubClientSecret, //clave secreta de github
        callbackURL: enviroment.githubCallbackURL, //url callback de github
      },
      async (accessToken, refreshToken, profile, done) => {
        authController.githubAuth(accessToken, refreshToken, profile, done);
      }
    )
  );

  passport.use(
    "current",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: enviroment.jwt.SECRET,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    if (user._id) {
      // Si el usuario tiene un _id, lo serializamos normalmente
      done(null, user._id);
    } else {
      // Si es un usuario administrador predefinido, serializamos con un identificador "admin" para que tenga un identificador único
      done(null, "admin");
    }
  });

  passport.deserializeUser(async (id, done) => {
    try {
      if (id === "admin") {
        // Si coincide con el usuario "admin" creamos un objeto para con los datos del admin
        const adminUser = {
          first_name: "Admin",
          last_name: "Coder",
          email: "adminCoder@coder.com",
          age: 30, // Puedes establecer la edad predeterminada del administrador
          role: "admin", // Asignar el rol de administrador
        };
        done(null, adminUser);
      } else {
        let user = await userService.findUserById(id);
        done(null, user);
      }
    } catch (error) {
      done(error);
    }
  });
};

export default initializePassport;
