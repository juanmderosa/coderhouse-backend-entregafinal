import { ticketsService } from "../services/tickets.service.js";
import { cartService } from "../services/carts.service.js";
import crypto from "crypto";
import CurrentDTO from "../dao/DTOs/currentDTO.js";
import { ticketDTO } from "../dao/DTOs/ticketDTO.js";

class TicketsManager {
  async createTicket(req, res) {
    //Obtenemos el cartId y el usuario
    const { cid } = req.params;
    const currentUser = new CurrentDTO(req.user);
    try {
      //Obtener los productos del carrito
      const productsInCart = await cartService.getProductsByCartId(cid);
      const { productsInStock, productsWithOutStock } =
        await ticketDTO.verifyStock(productsInCart.products);

      // Calcular el total
      let amount = ticketDTO.calculateAmount(productsInStock);

      // Se crea el ticket
      const code = crypto.randomUUID();
      const purchase_datetime = new Date().toString();
      const newTicket = {
        code,
        purchase_datetime,
        amount,
        purchaser: currentUser.email,
      };

      // Se guarda el ticket
      const createdTicket = await ticketsService.createTicket(newTicket);
      let deletedProducts;
      //Borra del carrito los productos que fueron procesados
      if (productsInStock.length > 0) {
        deletedProducts = await ticketDTO.deletePurchasedProductsFromCart(
          productsInStock,
          cid
        );
      }

      if (productsInStock.length > 0) {
        req.logger.debug("Se creó el ticket", createdTicket);
        res.status(200).json({
          status: "success",
          payload: createdTicket,
          productsWithOutStock,
          deletedProducts,
        });
      } else {
        req.logger.error("No se pudo crear el ticket");
        res.status(500).json({ message: "All the produts are out of stock" });
      }
    } catch (error) {
      req.logger.error("No se pudo crear el ticket", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener todos un ticket por Id
  async getTicketById(req, res) {
    const { cid } = req.params;
    try {
      const ticket = await ticketsService.getTicketById(cid);
      req.logger.debug("Se obtuvo el ticket", ticket);
      res.status(200).json(ticket);
    } catch (error) {
      req.logger.error("No se pudo obtener el ticket", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export const ticketsController = new TicketsManager();
