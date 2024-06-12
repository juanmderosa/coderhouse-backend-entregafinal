import { validateCart } from "../../../utils/cartError.js";
import { CustomError } from "../../../utils/customError.js";
import { errorTypes } from "../../../utils/errorTypes.js";
import { logger } from "../../../utils/Logger.js";
import { cartsModel } from "../models/carts.model.js";

export default class Carts {
  createCart = async () => {
    let result = await cartsModel.create({ products: [] });
    return result;
  };

  getProductsByCartId = async (cid) => {
    let result = await cartsModel.findById(cid).lean();
    return result;
  };

  addProductsToCart = async (cid, pid, quantity) => {
    if (quantity || typeof quantity === "number" || quantity > 0) {
      const cart = await cartsModel.findById(cid);
      const productIndex = cart.products.findIndex(
        (item) => item.product._id.toString() === pid.toString()
      );

      if (productIndex === -1) {
        cart.products.push({ product: pid, quantity });
      } else {
        throw new Error("Product already exists in cart");
      }
      return await cart.save();
    } else {
      throw CustomError.CustomError(
        "Missing Data",
        "Missing or invalid quantity in request",
        errorTypes.ERROR_INVALID_ARGUMENTS,
        validateCart(quantity)
      );
    }
  };

  deleteCart = async (cid) => {
    try {
      let data = await cartsModel.deleteOne({ _id: cid });
      return data;
    } catch (error) {
      logger.error(error);
    }
  };

  deleteProductsFromCart = async (cid, pid) => {
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
  };

  editProductQuantityFromCart = async (cid, pid, quantity) => {
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
  };

  updateCartWithProducts = async (cid, newProducts) => {
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
  };
}
