import { productService } from "../../services/products.service.js";
import { cartService } from "../../services/carts.service.js";

class TicketDTO {
  calculateAmount(products) {
    return products.reduce((total, prod) => {
      return total + prod.product.price * prod.quantity;
    }, 0);
  }

  async verifyStock(products) {
    const productsInStock = [];
    const productsWithOutStock = [];
    for (const prod of products) {
      const product = await productService.getProductsById(prod.product._id);
      if (product.stock >= prod.quantity) {
        product.stock -= prod.quantity;
        await productService.updateProduct(prod.product._id, {
          stock: product.stock,
        });
        productsInStock.push(prod);
      } else {
        productsWithOutStock.push(prod.product._id);
      }
    }
    return { productsInStock, productsWithOutStock };
  }

  async deletePurchasedProductsFromCart(products, cid) {
    const deletedProducts = await Promise.all(
      products.map(async (prod) => {
        await cartService.deleteProductsFromCart(cid, prod.product._id);
        return prod.product._id; // Retorna el ID del producto eliminado
      })
    );

    return deletedProducts;
  }
}

export const ticketDTO = new TicketDTO();
