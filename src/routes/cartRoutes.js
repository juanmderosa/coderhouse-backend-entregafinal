import { Router } from "express";
import { cartManager } from "../dao/services/cartManager.js";

export const cartRouter = Router();

cartRouter.post("/", async (req, res) => {
  await cartManager.createCart();
  try {
    res.json({ status: "succes" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

cartRouter.get("/:cid", async (req, res) => {
  const id = req.params.cid;
  console.log(id);
  const cart = await cartManager.getProductsByCartId(id);
  try {
    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const updatedCart = await cartManager.addProductsToCart(cid, pid, quantity);
    res.json({ status: "success", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

cartRouter.delete("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const updatedCart = await cartManager.deleteCart(cid);
    res.json({ status: "success", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const updatedCart = await cartManager.deleteProductsFromCart(cid, pid);
    res.json({ status: "success", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

cartRouter.put("/:cid/products/:pid", async (req, res) => {
  const { quantity } = req.body;
  const { cid, pid } = req.params;

  try {
    const updatedCart = await cartManager.editProductQuantityFromCart(
      cid,
      pid,
      quantity
    );
    res.json({ status: "success", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
