import productsService from "../services/products.service.js";

class ProductManager {
  //Ver todos los productos
  async getProducts(req, res) {
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

      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  //Ver producto por ID
  async getProductsById(req, res) {
    let { pid } = req.params;
    try {
      const product = await productsService.getProductsById(pid);
      if (!product) return res.send({ error: "Producto no encontrado" });
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  //Agregar nuevo producto
  async addProducts(req, res) {
    const newProduct = req.body;
    try {
      await productsService.addProducts(newProduct);
      res.json({ status: "succes", newProduct });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  //Editar o Actualizar Producto
  async updateProduct(req, res) {
    const productId = req.params.pid;
    const updatedFields = req.body;
    try {
      const updatedProduct = await productsService.updateProduct(
        productId,
        updatedFields
      );
      res.json({ status: "success", updatedProduct });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  //Eliminar producto
  async deleteProduct(req, res) {
    const productId = req.params.pid;
    try {
      await productsService.deleteProduct(productId);
      res.json({ status: "success" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export const productController = new ProductManager();
