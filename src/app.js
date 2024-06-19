import express from "express";
import { productRouter } from "./routes/productRoutes.js";
import { cartRouter } from "./routes/cartRoutes.js";
import rootDir from "./utils/utils.js";
import handlebars from "express-handlebars";
import viewRouter from "./routes/viewsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import sessionsRouter from "./routes/sessionsRouter.js";
import { messageRouter } from "./routes/chatRoutes.js";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import { enviroment } from "./config/config.js";
import MongoSingleton from "./config/mongo.config.js";
import { initializeChatSocket } from "./sockets/chatSocket.js";
import mockingRouter from "./routes/mockingRoutes.js";
import { addLogger, logger } from "./utils/Logger.js";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import { swaggerSpecs } from "./utils/swaggerConfig.js";
import swaggerUiExpress from "swagger-ui-express";

//Creación de servidor con express
const app = express();

//Conexión a Base de Datos
MongoSingleton.getInstance();

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(rootDir + "/public"));
app.use(
  session({
    store: new MongoStore({
      mongoUrl: enviroment.mongoUrl,
      ttl: 3600,
    }),
    secret: enviroment.mongoSecret,
    resave: false,
    saveUninitialized: false,
  })
);

//Gestión de vistas
app.set("views", rootDir + "/views");
app.set("view engine", "handlebars");
app.engine("handlebars", handlebars.engine());
app.use(viewRouter);

//Inicializar Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(addLogger);

//Swagger
//Route Docs
app.use(
  "/apidocs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(swaggerSpecs, {
    customCss: ".swagger-ui .topbar { display: none }",
  })
);

//Listen
const server = app.listen(enviroment.port, () => {
  logger.info(
    `servidor corriendo en el puerto ${enviroment.port}, http://localhost:${enviroment.port}`
  );
});

//Routes
app.use("/", viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/messages", messageRouter);
app.use("/api/users", userRouter);
app.use("/api/mockingproducts", mockingRouter);

//Inicializar Sockets
initializeChatSocket(server);
