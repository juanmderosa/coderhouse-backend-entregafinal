import { Router } from "express";
import { productController } from "../controllers/products.controller.js";
import { authorization } from "../middlewares/auth.js";

export const productRouter = Router();

productRouter.get("/", productController.getProducts);
productRouter.get("/:pid", productController.getProductsById);
productRouter.get("/code/:code", productController.getProductsByCode);
productRouter.post(
  "/",
  authorization(["admin", "premium"]),
  productController.addProducts
);
productRouter.put(
  "/:pid",
  authorization("admin"),
  productController.updateProduct
);
productRouter.delete(
  "/:pid",
  authorization(["premium", "admin"]),
  productController.deleteProduct
);
