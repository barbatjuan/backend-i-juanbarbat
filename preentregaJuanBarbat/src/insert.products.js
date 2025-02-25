import { PetModel } from "./models/perros.models.js";
import mongoose from "mongoose";

// Conectar a MongoDB
mongoose
  .connect("mongodb://admin:123admin@localhost:27017/tienda_mascotas")
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error de conexión a MongoDB:", err));

// Crear y guardar una nueva mascota
const nuevaMascota = new PetModel({
  title: "Pastor Uruguayo",
  description: "Perro guardián",
  price: 200,
  stock: 10,
  category: "Perro",
});

nuevaMascota
  .save()
  .then(() => {
    console.log("Mascota guardada correctamente");
    mongoose.connection.close(); // Cerrar la conexión después de guardar
  })
  .catch((err) => {
    console.error("Error al guardar la mascota:", err);
    mongoose.connection.close(); // Cerrar la conexión en caso de error
  });
