import { messageService } from "../services/message.service.js";

class MessageManager {
  // Crear un nuevo mensaje
  async createMessage(req, res) {
    const newMessage = req.body;
    try {
      await messageService.createMessage(newMessage);
      req.logger.debug_("Se ha creado el nuevo mensaje", newMessage);
      res.json({ status: "success" });
    } catch (error) {
      req.logger.error("No se pudo crear el mensaje", error);
      res.status(500).json({ error: error.message });
    }
  }
  // Obtener todos los mensajes
  async getMessages(req, res) {
    try {
      const messages = await messageService.getMessages();
      req.logger.debug("Listado de mensajes", messages);
      res.json(messages);
    } catch (error) {
      req.logger.error("No se pudieron obtener los mensajes", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export const messagesController = new MessageManager();
