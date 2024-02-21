import { randomUUID } from "crypto";
import fs from "fs";
import __dirname from "../utils.js";
console.log(__dirname);

class CartManager {
  constructor() {
    this.path = `${__dirname}/data/carrito.json`;
    console.log(this.path);
  }

  async createCart() {
    try {
      let carts = [];
      const fileExists = fs.existsSync(this.path);

      if (fileExists) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        if (data.trim() !== "") {
          carts = JSON.parse(data);
        }
      } else {
        await fs.promises.writeFile(this.path, "[]");
      }

      const id = randomUUID();
      const newCart = { id, products: [] };
      carts.push(newCart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
      console.log("Nuevo carrito creado:", newCart);
    } catch (error) {
      console.error("Error al crear el carrito:", error);
    }
  }

  async getProductsByCartId(id) {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const cartList = JSON.parse(data);
      const cart = cartList.find((cart) => cart.id === id);

      if (!cart) {
        console.log("Carrito no encontrado");
      }
      console.log("getProductsByCartId", cart);
      return cart;
    } catch (error) {
      throw new Error("Error al obtener productos del carrito");
    }
  }
  async addProductsToCart(id, productId, quantity) {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      let cartList = JSON.parse(data);
      const cartIndex = cartList.findIndex((cart) => cart.id === id);

      if (cartIndex === -1) {
        throw new Error("No existe un carrito con ese ID");
      }

      const productIndex = cartList[cartIndex].products.findIndex(
        (product) => product.product === productId
      );

      if (productIndex !== -1) {
        cartList[cartIndex].products[productIndex].quantity += quantity;
      } else {
        cartList[cartIndex].products.push({ product: productId, quantity });
      }

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(cartList, null, "\t")
      );

      return cartList[cartIndex];
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export const cartManager = new CartManager();
