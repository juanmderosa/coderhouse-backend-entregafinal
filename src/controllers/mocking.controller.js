import { mockingService } from "../services/mocking.service.js";

class MockingManager {
  async createProduct(req, res) {
    try {
      const products = await mockingService.getProducts();
      res.json({ status: "success", payload: products });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const mockingController = new MockingManager();
