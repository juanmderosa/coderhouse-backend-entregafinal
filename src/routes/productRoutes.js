import { Router } from "express";
import { productManager } from "../class/productManager.js";

export const productRouter = Router();

productRouter.get("/", async (req, res) => {
  const allProducts = await productManager.getProducts();
  const limit = parseInt(req.query.limit);
  try {
    if (allProducts.length === 0) return res.send("No hay productos");
    if (!limit) {
      res.send(allProducts);
    } else {
      const limitedProducts = allProducts.slice(0, limit);
      res.json(limitedProducts);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

productRouter.get("/:pid", async (req, res) => {
  let id = req.params.pid;
  try {
    const allProducts = await productManager.getProducts();
    let data = allProducts.find((product) => product.id == id);
    if (!data) return res.send({ error: "Producto no encontrado" });
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

productRouter.post("/", async (req, res) => {
  const newProduct = req.body;
  try {
    await productManager.addProducts(newProduct);
    res.json({ status: "succes" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

productRouter.put("/:pid", async (req, res) => {
  const productId = req.params.pid;
  const updatedFields = req.body;
  try {
    const updatedProduct = await productManager.updateProduct(
      productId,
      updatedFields
    );
    res.json({ status: "success", updatedProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

productRouter.delete("/:pid", async (req, res) => {
  const productId = req.params.pid;
  try {
    await productManager.deleteProduct(productId);
    res.json({ status: "success" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
