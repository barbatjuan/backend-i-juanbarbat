// config/index.js
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  dirname: __dirname,
  PORT: 3006,
  db: {
    connectionString:
      "mongodb+srv://admin:123admin@cluster0.2r3j9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  },
};

export default config; // Exportación default de config
