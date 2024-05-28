import { cartService } from "../services/carts.service.js";

class CartManager {
  //Crear un nuevo carrito
  async createCart(req, res) {
    try {
      const cart = await cartService.createCart();
      res.json({ status: "success", cart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //Ver productos de un carrito por id de carrito
  async getProductsByCartId(req, res) {
    const cid = req.params.cid;
    const cart = await cartService.getProductsByCartId(cid);
    try {
      res.json(cart.products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //Agregar productos a carrito
  async addProductsToCart(req, res) {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
      const updatedCart = await cartService.addProductsToCart(
        cid,
        pid,
        quantity
      );

      res.json({ status: "success", cart: updatedCart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  //Eliminar un carrito
  async deleteCart(req, res) {
    const { cid } = req.params;
    try {
      const updatedCart = await cartService.deleteCart(cid);
      res.json({ status: "success", cart: updatedCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //Eliminar productos de un carrito
  async deleteProductsFromCart(req, res) {
    const { cid, pid } = req.params;
    try {
      const updatedCart = await cartService.deleteProductsFromCart(cid, pid);
      res.json({ status: "success", cart: updatedCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //Editar cantidad de un producto en el carrito
  async editProductQuantityFromCart(req, res) {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
      const updatedCart = await cartService.editProductQuantityFromCart(
        cid,
        pid,
        quantity
      );

      res.json({ status: "success", cart: updatedCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //Editar carrito con productos (agregar productos)
  async updateCartWithProducts(req, res) {
    const { cid } = req.params;
    const newProducts = req.body;

    try {
      const updatedCart = await cartService.updateCartWithProducts(
        cid,
        newProducts
      );
      res.json({ status: "success", cart: updatedCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const cartController = new CartManager();
