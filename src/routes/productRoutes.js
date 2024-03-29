import { Router } from "express";
import { productManager } from "../dao/services/productManager.js";

export const productRouter = Router();

productRouter.get("/", async (req, res) => {
  try {
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    let queryParam = req.query.query;
    let sortParam = req.query.sort;

    if (!page) page = 1;
    if (!limit) limit = 6;
    if (!queryParam) queryParam = "";
    if (!sortParam) sortParam = "desc";

    const response = await productManager.getProducts(
      page,
      limit,
      queryParam,
      sortParam
    );

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

productRouter.get("/:pid", async (req, res) => {
  let { pid } = req.params;
  console.log(pid);
  try {
    const product = await productManager.getProductsById(pid);
    if (!product) return res.send({ error: "Producto no encontrado" });
    res.json(product);
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
