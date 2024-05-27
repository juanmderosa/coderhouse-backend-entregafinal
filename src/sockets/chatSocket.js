import { messagesRepository } from "../repositories/index.js";
import { Server } from "socket.io";

export const initializeChatSocket = (server) => {
  const io = new Server(server);

  io.removeAllListeners();
  io.on("connection", async (socket) => {
    const allMessages = await messagesRepository.getMessages();
    socket.emit("allMessages", allMessages);
    socket.on("auth", (user) => {
      console.log(user);
      socket.user = user;
    });
    socket.on("message", async (data) => {
      try {
        const messageData = { ...data, email: socket.user.payload.email };
        await messagesRepository.createMessage(messageData);
        console.log("data", messageData);
        io.emit("messageLogs", messageData);
      } catch (error) {
        console.error("Error al guardar el mensaje:", error);
        socket.emit("error", { message: "Error al guardar el mensaje" });
      }
    });
  });
};
