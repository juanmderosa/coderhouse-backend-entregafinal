import { productRepository } from "../repositories/index.js";

class ProductService {
  async getProducts(page, limit, queryParam, sortParam) {
    return productRepository.getProducts(page, limit, queryParam, sortParam);
  }

  async getProductsById(id) {
    return productRepository.getProductsById(id);
  }

  async addProducts(product) {
    return productRepository.addProducts(product);
  }

  async updateProduct(id, updatedFields) {
    return productRepository.updateProduct(id, updatedFields);
  }

  async deleteProduct(id) {
    return productRepository.deleteProduct(id);
  }
}

export const productService = new ProductService();
