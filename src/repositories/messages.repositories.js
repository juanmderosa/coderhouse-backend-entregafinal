export default class MessageRepository {
  constructor(dao) {
    this.dao = dao;
  }

  createMessage = async (message) => {
    return await this.dao.createMessage(message);
  };

  getMessages = async () => {
    return await this.dao.getMessages();
  };
}
