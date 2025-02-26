import { Router } from "express";
import {
  getAllCarts,
  getCartById,
  createCart,
  addProductToCart,
} from "../controllers/Cart.Controller.js"; // Importar funciones del controlador

export const CartsRouter = Router();

// Obtener todos los carritos
CartsRouter.get("/", getAllCarts);

// Obtener un carrito por ID (ObjectId o UUID)
CartsRouter.get("/:cid", getCartById);

// Crear un nuevo carrito
CartsRouter.post("/", createCart);

// Agregar un producto a un carrito existente
CartsRouter.post("/:cid/product/:pid", addProductToCart);
