import { Router } from "express";
import { messagesController } from "../controllers/messages.controller.js";
import { authorization } from "../middlewares/auth.js";

export const messageRouter = Router();

messageRouter.post(
  "/",
  authorization("usuario"),
  messagesController.createMessage
);
messageRouter.get("/", messagesController.getMessages);
