import { Router } from "express";
import { productController } from "../controllers/products.controller.js";
import { authorization } from "../middlewares/auth.js";

export const productRouter = Router();

productRouter.get("/", productController.getProducts);
productRouter.get("/:pid", productController.getProductsById);
productRouter.post("/", authorization("admin"), productController.addProducts);
productRouter.put(
  "/:pid",
  authorization("admin"),
  productController.updateProduct
);
productRouter.delete(
  "/:pid",
  authorization("admin"),
  productController.deleteProduct
);
