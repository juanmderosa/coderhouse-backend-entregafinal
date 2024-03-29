import { Router } from "express";
import { productManager } from "../dao/services/productManager.js";
import { cartManager } from "../dao/services/cartManager.js";

const router = Router();

router.get("/", async (req, res) => {
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

    res.render("products", response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/product/:pid", async (req, res) => {
  const { pid } = req.params;
  const response = await productManager.getProductsById(pid);
  console.log(response);

  res.render("product", response);
});

router.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const response = await cartManager.getProductsByCartId(cid);
    res.render("cart", { response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/realtimeproducts", async (req, res) => {
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

    res.render("realtimeproducts", response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
