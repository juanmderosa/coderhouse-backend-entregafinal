import { cartRepository } from "../repositories/index.js";

class CartService {
  createCart = async () => {
    return await cartRepository.createCart();
  };

  getProductsByCartId = async (cid) => {
    return await cartRepository.getProductsByCartId(cid);
  };

  addProductsToCart = async (cid, pid, quantity) => {
    return await cartRepository.addProductsToCart(cid, pid, quantity);
  };

  deleteCart = async (cid) => {
    return await cartRepository.deleteCart(cid);
  };

  deleteProductsFromCart = async (cid, pid) => {
    return await cartRepository.deleteProductsFromCart(cid, pid);
  };

  editProductQuantityFromCart = async (cid, pid, quantity) => {
    return cartRepository.editProductQuantityFromCart(cid, pid, quantity);
  };

  updateCartWithProducts = async (cid, newProducts) => {
    return cartRepository.updateCartWithProducts(cid, newProducts);
  };
}

export const cartService = new CartService();
