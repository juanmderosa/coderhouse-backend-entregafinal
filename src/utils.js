import { fileURLToPath } from "url";
import { dirname } from "path";
const __fielname = fileURLToPath(import.meta.url);
const __dirname = dirname(__fielname);

export default __dirname;
