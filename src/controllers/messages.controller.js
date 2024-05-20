import { messageService } from "../services/message.service.js";

class MessageManager {
  // Crear un nuevo mensaje
  async createMessage(req, res) {
    const newMessage = req.body;
    try {
      await messageService.createMessage(newMessage);
      res.json({ status: "success" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // Obtener todos los mensajes
  async getMessages(req, res) {
    try {
      const messages = await messageService.getMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const messagesController = new MessageManager();
