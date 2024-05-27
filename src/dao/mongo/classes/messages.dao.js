import messagesModel from "../models/message.model.js";

export default class Messages {
  async createMessage(message) {
    let result = await messagesModel.create(message);
    return result;
  }

  async getMessages() {
    let result = await messagesModel.find();
    return result;
  }
}
