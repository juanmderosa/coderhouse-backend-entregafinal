import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "production" ? ".env" : ".env.dev";
dotenv.config({ path: envFile });

export const enviroment = {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  mongoSecret: process.env.MONGO_SECRET,
  githubClientID: process.env.GITHUB_CLIENTID,
  githubClientSecret: process.env.GITHUB_CLIENTSECRET,
  githubCallbackURL: process.env.GITHUB_CALLBACK,
  NODE_ENV: process.env.NODE_ENV,
  BASE_URL: process.env.BASE_URL,
  mailing: {
    PASSWORD: process.env.MAILING_PASSWORD,
    SERVICE: process.env.MAILING_SERVICE,
    HOST: process.env.MAILING_HOST,
    USER: process.env.MAILING_USER,
  },
  jwt: {
    COOKIE: process.env.JWT_COOKIE,
    SECRET: process.env.JWT_SECRET,
  },
};
