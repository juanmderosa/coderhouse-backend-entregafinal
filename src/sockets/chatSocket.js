import { messagesRepository } from "../repositories/index.js";
import { Server } from "socket.io";
import { logger } from "../utils/Logger.js";

export const initializeChatSocket = (server) => {
  const io = new Server(server);

  io.removeAllListeners();
  io.on("connection", async (socket) => {
    const allMessages = await messagesRepository.getMessages();
    socket.emit("allMessages", allMessages);
    socket.on("auth", (user) => {
      socket.user = user;
    });
    socket.on("message", async (data) => {
      try {
        const messageData = { ...data, email: socket.user.payload.email };
        await messagesRepository.createMessage(messageData);
        logger.debug("data", messageData);
        io.emit("messageLogs", messageData);
      } catch (error) {
        logger.error("Error al guardar el mensaje:", error);
        socket.emit("error", { message: "Error al guardar el mensaje" });
      }
    });
  });
};
