import { ticketsModel } from "../models/tickets.model.js";

export default class Tickets {
  async createTicket(ticket) {
    let result = await ticketsModel.create(ticket);
    return result;
  }

  async getTicketById(cid) {
    let result = await ticketsModel.findById(cid);
    return result;
  }
}
