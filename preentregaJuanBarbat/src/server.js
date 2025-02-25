import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { config, connectDB } from "./config/index.js"; // Importa connectDB y config
import initApp from "./app/index.js";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = join(dirname(__filename), "../../");

console.log(config.dirname);

const startServer = async () => {
  await connectDB(); // Conecta a MongoDB antes de iniciar el servidor

  const app = initApp(); // Inicializa la app

  const server = app.listen(config.PORT, () => {
    console.info(`🚀 Server running at http://localhost:${config.PORT}`);
  });
};

startServer();
