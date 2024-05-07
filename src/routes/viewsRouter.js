import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import productsService from "../services/products.service.js";
import cartsService from "../services/carts.service.js";

const router = Router();

router.get("/", auth, async (req, res) => {
  try {
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    let queryParam = req.query.query;
    let sortParam = req.query.sort;

    if (!page) page = 1;
    if (!limit) limit = 10;
    if (!queryParam) queryParam = "";
    if (!sortParam) sortParam = "desc";

    const response = await productsService.getProducts(
      page,
      limit,
      queryParam,
      sortParam
    );

    res.render("products", {
      products: response.payload,
      user: req.session.user,
      totalPages: response.totalPages,
      prevPage: response.prevPage,
      nextPage: response.nextPage,
      page: response.page,
      hasPrevPage: response.hasPrevPage,
      hasNextPage: response.hasNextPage,
      prevLink: response.prevLink,
      nextLink: response.nextLink,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/product/:pid", auth, async (req, res) => {
  const { pid } = req.params;
  const response = await productsService.getProductsById(pid);
  console.log(response);

  res.render("product", response);
});

router.get("/carts/:cid", auth, async (req, res) => {
  const { cid } = req.params;
  try {
    const response = await cartsService.getProductsByCartId(cid);
    res.render("cart", { response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/realtimeproducts", auth, async (req, res) => {
  try {
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    let queryParam = req.query.query;
    let sortParam = req.query.sort;

    if (!page) page = 1;
    if (!limit) limit = 10;
    if (!queryParam) queryParam = "";
    if (!sortParam) sortParam = "desc";

    const response = await productsService.getProducts(
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

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/profile", auth, (req, res) => {
  res.render("profile", {
    user: req.session.user,
  });
});

router.get("/restore", (req, res) => {
  res.render("restore");
});

export default router;
