import express from "express";
import { productRouter } from "./routes/productRoutes.js";
import { cartRouter } from "./routes/cartRoutes.js";
import __dirname from "./utils.js";
console.log(__dirname);

const port = 8080;
const app = express();
//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Listen
app.listen(port, () => {
  console.log(`servidor corriendo en el puerto ${port}`);
});

//Routes
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
