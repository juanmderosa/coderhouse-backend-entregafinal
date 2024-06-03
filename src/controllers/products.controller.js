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

  async getProductsByCode(req, res) {
    let { code } = req.params;
    try {
      const product = await productService.getProductsByCode(code);
      if (!product) return res.send({ error: "Producto no encontrado" });
      res.status(200).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async addProducts(req, res) {
    const newProduct = req.body;

    try {
      let validProps = [
        "title",
        "description",
        "price",
        "code",
        "stock",
        "thumbnail",
        "status",
      ];
      let newproductProps = Object.keys(req.body);
      let valid = newproductProps.every((prop) => validProps.includes(prop));

      const hasAllRequiredProps = validProps.every(
        (prop) =>
          newproductProps.includes(prop) &&
          newProduct[prop] !== undefined &&
          newProduct[prop] !== null
      );
      if (!hasAllRequiredProps) {
        return res.status(400).json({
          error:
            "Debes agregar todos los campos requeridos para crear un nuevo producto.",
          detalle: validProps,
        });
      }

      if (!hasAllRequiredProps) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({
          error: `You have entered invalid properties`,
          detalle: validProps,
        });
      }

      let exist = await productService.getProductsByCode(newProduct.code);
      if (exist) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({
          error: `The product with the code ${newProduct.code} already exists`,
        });
      }

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
