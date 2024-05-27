import { messagesRepository } from "../repositories/index.js";

class MessageService {
  createMessage = async (message) => {
    return await messagesRepository.createMessage(message);
  };

  getMessages = async () => {
    return await messagesRepository.getMessages();
  };
}

export const messageService = new MessageService();
