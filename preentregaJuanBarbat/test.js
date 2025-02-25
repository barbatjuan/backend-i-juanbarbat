import mongoose from "mongoose"; // Si usas ES modules
// const mongoose = require('mongoose'); // Si usas CommonJS

mongoose
  .connect("mongodb://localhost:27017/test")
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar:", err));
