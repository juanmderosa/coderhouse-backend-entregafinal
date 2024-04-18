import express from "express";
import { productRouter } from "./routes/productRoutes.js";
import { cartRouter } from "./routes/cartRoutes.js";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import viewRouter from "./routes/viewsRouter.js";
import mongoose from "mongoose";
import { productManager } from "./dao/services/productManager.js";
import viewsRouter from "./routes/viewsRouter.js";
import sessionsRouter from "./routes/sessionsRouter.js";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import initilizePassport from "./dao/config/passport.config.js";

const PORT = process.env.PORT | 8080;
const app = express();
const DBURL =
  "mongodb+srv://juanmderosa:sGD3FNfTmzJ0dlNS@cluster0.mo9zqch.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(DBURL);
    console.log("Conectado con MongoDB");
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

connectMongoDB();

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(
  session({
    store: new MongoStore({
      mongoUrl: DBURL,
      ttl: 3600,
    }),
    secret: "Secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.engine("handlebars", handlebars.engine());
app.use(viewRouter);

//Inicializar Passport
initilizePassport();
app.use(passport.initialize());
app.use(passport.session());

//Listen
const server = app.listen(PORT, () => {
  console.log(`servidor corriendo en el puerto ${PORT}`);
});
const io = new Server(server);

//Routes
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", sessionsRouter);

io.removeAllListeners();
io.on("connection", async (socket) => {
  socket.on("getProducts", async () => {
    const allProducts = await productManager.getProducts();
    io.emit("updateProducts", allProducts);
  });

  socket.on("addProduct", async (newProduct) => {
    try {
      await productManager.addProducts(newProduct);
      const allProducts = await productManager.getProducts();
      io.emit("updateProducts", allProducts);
    } catch (error) {
      console.error("Error al agregar el producto:", error.message);
    }
  });
});
