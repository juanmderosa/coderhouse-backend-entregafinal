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
};
