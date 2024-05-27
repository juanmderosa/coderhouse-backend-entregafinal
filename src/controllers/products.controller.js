import { productService } from "../services/products.service.js";

class ProductController {
  async getProducts(req, res) {
    try {
      let page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;
      let queryParam = req.query.query || "";
      let sortParam = req.query.sort || "desc";

      const response = await productService.getProducts(
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
  }

  async getProductsById(req, res) {
    let { pid } = req.params;
    try {
      const product = await productService.getProductsById(pid);
      if (!product) return res.send({ error: "Producto no encontrado" });
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async addProducts(req, res) {
    const newProduct = req.body;
    try {
      await productService.addProducts(newProduct);
      res.json({ status: "success", newProduct });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    const productId = req.params.pid;
    const updatedFields = req.body;
    try {
      const updatedProduct = await productService.updateProduct(
        productId,
        updatedFields
      );
      res.json({ status: "success", updatedProduct });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    const productId = req.params.pid;
    try {
      await productService.deleteProduct(productId);
      res.json({ status: "success" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export const productController = new ProductController();
