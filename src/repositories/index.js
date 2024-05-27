import ProductRepository from "./products.repositories.js";
import Products from "../dao/mongo/classes/products.dao.js";
import CartRepository from "./carts.repositories.js";
import Carts from "../dao/mongo/classes/carts.dao.js";
import Users from "../dao/mongo/classes/users.dao.js";
import UsersRepository from "./users.repositoies.js";
import Messages from "../dao/mongo/classes/messages.dao.js";
import MessageRepository from "./messages.repositories.js";
import TicketsRepository from "./ticket.repositories.js";
import Tickets from "../dao/mongo/classes/tickets.dao.js";

const productDao = new Products();
const cartDao = new Carts();
const usersDao = new Users();
const messageDao = new Messages();
const ticketsDao = new Tickets();

export const productRepository = new ProductRepository(productDao);
export const cartRepository = new CartRepository(cartDao);
export const usersRepository = new UsersRepository(usersDao);
export const messagesRepository = new MessageRepository(messageDao);
export const ticketsRepository = new TicketsRepository(ticketsDao);
