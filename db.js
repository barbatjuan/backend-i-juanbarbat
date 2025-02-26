import mongoose from "mongoose";

// Cadena de conexión a MongoDB
const uri = "mongodb://root:pass12345@localhost:27017/tienda_mascotas";

// Conectar a MongoDB
mongoose
  .connect(uri)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error de conexión a MongoDB:", err));
