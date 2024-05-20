import { ticketsRepository } from "../repositories/index.js";

class TicketsService {
  createTicket = async (ticket) => {
    return await ticketsRepository.createTicket(ticket);
  };

  getTicketById = async (cid) => {
    return await ticketsRepository.getTicketById(cid);
  };
}

export const ticketsService = new TicketsService();
