import __dirname from "../../utils.js";
import { cartsModel } from "../models/carts.js";

class CartManager {
  async createCart() {
    let result = await cartsModel.create();
    console.log(result);
    return result;
  }
  async getProductsByCartId(id) {
    let result = await cartsModel.findById(id).lean();
    console.log(result);
    return result;
  }

  async deleteCart(id) {
    try {
      let data = await cartsModel.deleteOne({ _id: id });
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteProductsFromCart(cid, pid) {
    try {
      const cart = await cartsModel.findById(cid);
      if (!cart) {
        throw new Error("Cart not found");
      }
      const productIndex = cart.products.findIndex(
        (item) => item.product._id.toString() === pid.toString()
      );
      if (productIndex === -1) {
        throw new Error("Product not found in cart");
      }
      cart.products.splice(productIndex, 1);
      await cart.save();
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async addProductsToCart(id, productId, quantity) {
    const cart = await cartsModel.findById(id);
    console.log(cart);

    const productIndex = cart.products.findIndex(
      (item) => item.product._id.toString() === productId.toString()
    );

    if (productIndex === -1) {
      cart.products.push({ product: productId, quantity });
    } else {
      throw new Error("Product already exists in cart");
    }

    return await cart.save();
  }

  async editProductQuantityFromCart(cid, pid, quantity) {
    try {
      const cart = await cartsModel.findById(cid);
      if (!cart) {
        throw new Error("Cart not found");
      }
      const productIndex = cart.products.findIndex(
        (item) => item.product._id.toString() === pid.toString()
      );
      if (productIndex === -1) {
        throw new Error("Product not found in cart");
      }
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async updateCartWithProducts(cid, newProducts) {
    try {
      const cart = await cartsModel.findById(cid);

      if (!cart) {
        throw new Error("Cart not found");
      }

      for (const newProduct of newProducts) {
        const existingProductIndex = cart.products.findIndex(
          (item) =>
            item.product._id.toString() === newProduct.product.toString()
        );

        if (existingProductIndex !== -1) {
          cart.products[existingProductIndex].quantity += newProduct.quantity;
        } else {
          cart.products.push(newProduct);
        }
      }

      await cart.save();

      return cart;
    } catch (error) {
      throw error;
    }
  }
}

export const cartManager = new CartManager();
