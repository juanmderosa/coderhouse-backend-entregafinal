import { Router } from "express";
import { productController } from "../controllers/products.controller.js";

export const productRouter = Router();

productRouter.get("/", productController.getProducts);
productRouter.get("/:pid", productController.getProductsById);
productRouter.post("/", productController.addProducts);
productRouter.put("/:pid", productController.updateProduct);
productRouter.delete("/:pid", productController.deleteProduct);
