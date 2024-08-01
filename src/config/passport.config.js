import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { enviroment } from "./config.js";
import { userService } from "../services/users.service.js";
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
        clientID: enviroment.githubClientID,
        clientSecret: enviroment.githubClientSecret,
        callbackURL: enviroment.githubCallbackURL,
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
      done(null, user._id);
    } else {
      done(null, "admin");
    }
  });

  passport.deserializeUser(async (id, done) => {
    try {
      if (id === "admin") {
        const adminUser = {
          first_name: "Admin",
          last_name: "Coder",
          email: "adminCoder@coder.com",
          age: 30,
          role: "admin",
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
