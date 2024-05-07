import mongoose from "mongoose";
import { enviroment } from "./config.js";

export default class MongoSingleton {
  static #instance;

  constructor() {
    const connectMongoDB = async () => {
      try {
        await mongoose.connect(enviroment.mongoUrl);
        console.log("Conectado con MongoDB");
      } catch (error) {
        console.log(error);
        process.exit();
      }
    };
    connectMongoDB();
  }
  static getInstance() {
    if (this.#instance) {
      console.log("Ya estás conectado");
      return this.#instance;
    }
    this.#instance = new MongoSingleton();
    console.log("Conectado a la base de datos");
    return this.#instance;
  }
}
