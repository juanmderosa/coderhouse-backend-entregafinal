export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getProducts = async (page, limit, queryParam, sortParam) => {
    return this.dao.getProducts(page, limit, queryParam, sortParam);
  };

  getProductsById = async (id) => {
    return this.dao.getProductsById(id);
  };

  addProducts = async (product) => {
    return this.dao.addProducts(product);
  };

  updateProduct = async (id, updatedFields) => {
    return this.dao.updateProduct(id, updatedFields);
  };

  deleteProduct = async (id) => {
    return this.dao.deleteProduct(id);
  };
}
