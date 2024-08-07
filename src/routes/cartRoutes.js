import { Router } from "express";
import { cartController } from "../controllers/carts.controller.js";
import { authorization } from "../middlewares/auth.js";
import { ticketsController } from "../controllers/tickets.controller.js";

export const cartRouter = Router();

cartRouter.post("/", cartController.createCart);
cartRouter.get("/:cid", cartController.getProductsByCartId);
cartRouter.put("/:cid", cartController.updateCartWithProducts);
cartRouter.delete("/:cid", cartController.deleteCart);
cartRouter.post(
  "/:cid/products/:pid",
  authorization(["usuario", "premium"]),
  cartController.addProductsToCart
);
cartRouter.delete("/:cid/products/:pid", cartController.deleteProductsFromCart);
cartRouter.put(
  "/:cid/products/:pid",
  cartController.editProductQuantityFromCart
);
cartRouter.post("/:cid/purchase", ticketsController.createTicket);
