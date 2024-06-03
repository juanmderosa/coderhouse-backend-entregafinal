import { mockingRepository } from "../repositories/index.js";

class MockingService {
  getProducts = async () => {
    return await mockingRepository.getProducts();
  };
}

export const mockingService = new MockingService();
