import { cartService } from "../services/carts.service.js";

class CartManager {
  //Crear un nuevo carrito
  async createCart(req, res) {
    try {
      const cart = await cartService.createCart();
      req.logger.debug("Carrito creado", cart);

      res.json({ status: "success", cart });
    } catch (error) {
      req.logger.error("No se pudo crear el carrito", error);
      res.status(500).json({ error: error.message });
    }
  }

  //Ver productos de un carrito por id de carrito
  async getProductsByCartId(req, res) {
    const cid = req.params.cid;
    const cart = await cartService.getProductsByCartId(cid);
    req.logger.debug("Listado de producto en carrito", cart);

    try {
      res.json(cart.products);
    } catch (error) {
      req.logger.error(
        "No se pudieron obtener los productos del carrito",
        error
      );
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
      req.logger.debug("Se han agregado productos al carrito", updatedCart);

      res.json({ status: "success", cart: updatedCart });
    } catch (error) {
      req.logger.error(
        "No se pudieron agregar los productos al carrito",
        error
      );
      res.status(500).json({ error: error.message });
    }
  }

  //Eliminar un carrito
  async deleteCart(req, res) {
    const { cid } = req.params;
    try {
      const updatedCart = await cartService.deleteCart(cid);
      req.logger.debug("Se ha eliminado el carrito", updatedCart);
      res.json({ status: "success", cart: updatedCart });
    } catch (error) {
      req.logger.error("No se pudo eliminar el carrito", error);
      res.status(500).json({ error: error.message });
    }
  }

  //Eliminar productos de un carrito
  async deleteProductsFromCart(req, res) {
    const { cid, pid } = req.params;
    try {
      const updatedCart = await cartService.deleteProductsFromCart(cid, pid);

      req.logger.debug(
        "Se han eliminado los productos del carrito",
        updatedCart
      );

      res.json({ status: "success", cart: updatedCart });
    } catch (error) {
      req.logger.error(
        "No se pudieron eliminar los productos del carrito",
        error
      );
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

      req.logger.debug("Se actualizó la cantidad del carrito", updatedCart);
      res.json({ status: "success", cart: updatedCart });
    } catch (error) {
      req.logger.error("No se pudo actualizar la cantidad del carrito", error);
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

      req.logger.debug("Se actualizó el carrito", updatedCart);
      res.json({ status: "success", cart: updatedCart });
    } catch (error) {
      req.logger.error("No se pudo actualizar el carrito", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export const cartController = new CartManager();
