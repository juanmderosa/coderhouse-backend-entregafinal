import { mockingService } from "../services/mocking.service.js";

class MockingManager {
  async createProduct(req, res) {
    try {
      const products = await mockingService.getProducts();
      req.logger.debug("Se obtuvo el listado de productos", products);
      res.json({ status: "success", payload: products });
    } catch (error) {
      req.logger.error("No se pudo obtener el listado de productos", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export const mockingController = new MockingManager();
