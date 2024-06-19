import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { productRepository, usersRepository } from "../repositories/index.js";
import { cartRepository } from "../repositories/index.js";
import { messagesRepository } from "../repositories/index.js";
import { validateToken } from "../utils/jwt.js";

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

    const response = await productRepository.getProducts(
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
    req.logger.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/product/:pid", auth, async (req, res) => {
  const { pid } = req.params;
  const response = await productRepository.getProductsById(pid);

  if (!response) {
    req.logger.error("Product not found");
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.render("product", response);
});

router.get("/carts/:cid", auth, async (req, res) => {
  const { cid } = req.params;
  try {
    const response = await cartRepository.getProductsByCartId(cid);
    res.render("cart", response);
  } catch (error) {
    req.logger.error(error);
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

    const response = await productRepository.getProducts(
      page,
      limit,
      queryParam,
      sortParam
    );

    res.render("realtimeproducts", response);
  } catch (error) {
    req.logger.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/chat", async (req, res) => {
  try {
    const allMessages = await messagesRepository.getMessages();
    res.render("chat", allMessages);
  } catch (error) {
    req.logger.error("Error al cargar la página de chat:", error);
    res.status(500).send("Error al cargar la página de chat");
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

router.get("/restorepass/:token", async (req, res) => {
  const { token } = req.params;
  res.render("restorepass", { userId: token });
});

export default router;
