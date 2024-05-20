export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  createCart = async () => {
    return await this.dao.createCart();
  };

  getProductsByCartId = async (cid) => {
    return await this.dao.getProductsByCartId(cid);
  };

  addProductsToCart = async (cid, pid, quantity) => {
    return await this.dao.addProductsToCart(cid, pid, quantity);
  };

  deleteCart = async (cid) => {
    return await this.dao.deleteCart(cid);
  };

  deleteProductsFromCart = async (cid, pid) => {
    return await this.dao.deleteProductsFromCart(cid, pid);
  };

  editProductQuantityFromCart = async (cid, pid, quantity) => {
    return await this.dao.editProductQuantityFromCart(cid, pid, quantity);
  };

  updateCartWithProducts = async (cid, newProducts) => {
    return await this.dao.updateCartWithProducts(cid, newProducts);
  };
}
