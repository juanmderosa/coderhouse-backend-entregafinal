import { cartsModel } from "../models/carts.model.js";

const createCart = async () => {
  let result = await cartsModel.create();
  console.log(result);
  return result;
};

const getProductsByCartId = async (id) => {
  let result = await cartsModel.findById(id).lean();
  console.log(result);
  return result;
};

const addProductsToCart = async (cartId, productId, quantity) => {
  const cart = await cartsModel.findById(cartId);
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
};

const deleteCart = async (cid) => {
  try {
    let data = await cartsModel.deleteOne({ _id: cid });
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

const deleteProductsFromCart = async (cid, pid) => {
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

const editProductQuantityFromCart = async (cid, pid, quantity) => {
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

const updateCartWithProducts = async (cid, newProducts) => {
  try {
    const cart = await cartsModel.findById(cid);

    if (!cart) {
      throw new Error("Cart not found");
    }

    for (const newProduct of newProducts) {
      const existingProductIndex = cart.products.findIndex(
        (item) => item.product._id.toString() === newProduct.product.toString()
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

export default {
  createCart,
  getProductsByCartId,
  deleteCart,
  deleteProductsFromCart,
  addProductsToCart,
  editProductQuantityFromCart,
  updateCartWithProducts,
};
