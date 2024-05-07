import { Router } from "express";
import { cartController } from "../controllers/carts.controller.js";

export const cartRouter = Router();

cartRouter.post("/", cartController.createCart);
cartRouter.get("/:cid", cartController.getProductsByCartId);
cartRouter.post("/:cid/product/:pid", cartController.addProductsToCart);
cartRouter.delete("/:cid", cartController.deleteCart);
cartRouter.delete("/:cid/products/:pid", cartController.deleteProductsFromCart);
cartRouter.put(
  "/:cid/products/:pid",
  cartController.editProductQuantityFromCart
);
cartRouter.put("/:cid", cartController.updateCartWithProducts);
