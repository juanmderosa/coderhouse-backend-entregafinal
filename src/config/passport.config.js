import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import userModel from "../dao/models/users.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  //Registrar ususario loclamente
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
          const user = await userModel.findOne({ email: username });
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

          const result = await userModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //estrategia local para iniciar sesión
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          if (
            username === "adminCoder@coder.com" &&
            password === "adminCod3r123"
          ) {
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

          const user = await userModel.findOne({ email: username });
          if (!user) return done(null, false);
          const valid = isValidPassword(user, password);
          if (!valid) return done(null, false);

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Estrategia para iniciar sesión con github
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.0b6c43a94ee19828", //id de la app en github
        clientSecret: "876c1e54a56317c9af6ec7139e23a75285afcb5d", //clave secreta de github
        callbackURL: "http://localhost:8080/api/sessions/githubcallback", //url callback de github
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await userModel.findOne({
            email: profile._json.email,
          });
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
            let createdUser = await userModel.create(newUser);
            done(null, createdUser);
          } else {
            done(null, user);
          }
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
        let user = await userModel.findById(id);
        done(null, user);
      }
    } catch (error) {
      done(error);
    }
  });
};

export default initializePassport;
