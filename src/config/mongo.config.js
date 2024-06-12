import mongoose from "mongoose";
import { enviroment } from "./config.js";
import { logger } from "../utils/Logger.js";

export default class MongoSingleton {
  static #instance;

  constructor() {
    const connectMongoDB = async () => {
      try {
        await mongoose.connect(enviroment.mongoUrl);
        logger.info("Conectado con MongoDB");
      } catch (error) {
        logger.error("Ocurrió un error al conectar MONGO DB", error);
        process.exit();
      }
    };
    connectMongoDB();
  }
  static getInstance() {
    if (this.#instance) {
      logger.info("Ya estás conectado");
      return this.#instance;
    }
    this.#instance = new MongoSingleton();
    logger.info("Conectado a la base de datos");
    return this.#instance;
  }
}
