import jwt from "jsonwebtoken";
import { enviroment } from "../config/config.js";

export const generateToken = (userId) => {
  return jwt.sign({ userId }, enviroment.jwt.SECRET, { expiresIn: "1h" });
};

export const validateToken = (token) => {
  try {
    const decoded = jwt.verify(token, enviroment.jwt.SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};
