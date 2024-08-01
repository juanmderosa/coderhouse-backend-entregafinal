import swaggerJsdoc from "swagger-jsdoc";
import rootDir, { __dirname } from "../utils/utils.js";

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "E-commerce API",
      description:
        "API desarrollada para el curso de Backend con NodeJs de Coderhourse.",
    },
  },
  apis: [`${rootDir}/docs/**/*.yaml`],
};

export const swaggerSpecs = swaggerJsdoc(swaggerOptions);
