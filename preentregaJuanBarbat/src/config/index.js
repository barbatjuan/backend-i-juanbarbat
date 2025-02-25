import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

dotenv.config(); // Cargar las variables de entorno desde el archivo .env

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cadena de conexión a MongoDB Atlas desde .env (Asegúrate de tener la URL de tu base de datos en .env)
const connectionString =
  process.env.MONGO_URI ||
  "mongodb+srv://admin:123admin@cluster0.2r3j9.mongodb.net/Perros?retryWrites=true&w=majority";

// Función para conectar a MongoDB Atlas
export const connectDB = async () => {
  try {
    console.log(`🔄 Conectando a MongoDB en: ${connectionString}`);
    await mongoose.connect(connectionString, {
      useNewUrlParser: true, // Esta opción está deprecated en la versión 4.0.0 de mongoose, pero aún es útil para retrocompatibilidad
      useUnifiedTopology: true, // También deprecated, pero sigue siendo relevante
    });
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error de conexión a MongoDB:", error.message);
    process.exit(1); // Detener la aplicación si hay un error de conexión
  }
};

// Configuración general
export const config = {
  dirname: __dirname,
  PORT: process.env.PORT || 3006,
  db: {
    connectionString,
  },
};
