import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";

const __fielname = fileURLToPath(import.meta.url);
export const __dirname = dirname(__fielname);
const rootDir = dirname(__dirname); // Sube un nivel desde `utils`

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

export default rootDir;
