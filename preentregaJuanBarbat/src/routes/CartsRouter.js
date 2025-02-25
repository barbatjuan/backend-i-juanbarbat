import { Router } from "express";
import mongoose from "mongoose"; // Asegurar que ObjectId.isValid esté disponible
import { CartModel } from "../models/carts.models.js"; // Importar el modelo de carritos

export const CartsRouter = Router();

// Función para validar ID de MongoDB o UUID
function isValidId(id) {
  // Verifica si el ID es un ObjectId de MongoDB o un UUID
  return mongoose.Types.ObjectId.isValid(id) || /^[0-9a-fA-F-]{36}$/.test(id);
}

// Obtener todos los carritos
CartsRouter.get("/", async (req, res) => {
  try {
    const carts = await CartModel.find(); // Obtener todos los carritos desde MongoDB
    res.status(200).json({
      message: "Lista de carritos",
      data: carts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los carritos", error });
  }
});

// Obtener un carrito por ID (ObjectId o UUID)
CartsRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  if (!isValidId(cid)) {
    return res.status(400).json({ message: `ID de carrito inválido: ${cid}` });
  }

  try {
    // Si el ID es un ObjectId, se usa findById. Si es UUID, se busca por el campo 'uuid'.
    let cart;
    if (mongoose.Types.ObjectId.isValid(cid)) {
      cart = await CartModel.findById(cid); // Buscar por ObjectId
    } else {
      cart = await CartModel.findOne({ uuid: cid }); // Buscar por UUID (si tienes un campo 'uuid' en el modelo)
    }

    if (cart) {
      res.status(200).json({
        message: `Carrito con ID ${cid} encontrado`,
        data: cart,
      });
    } else {
      res.status(404).json({
        message: `Carrito con ID ${cid} no encontrado`,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al buscar el carrito", error });
  }
});

// Crear un nuevo carrito
CartsRouter.post("/", async (req, res) => {
  try {
    const newCart = new CartModel({
      customer_id: req.body.customer_id || null,
      products: [],
    });

    await newCart.save(); // Guardar el nuevo carrito en MongoDB

    res.status(201).json({
      message: "Carrito creado con éxito",
      data: newCart,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el carrito", error });
  }
});

// Agregar un producto a un carrito existente (ObjectId o UUID)
CartsRouter.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  // Verificar que los IDs sean válidos
  if (!isValidId(cid) || !isValidId(pid)) {
    return res
      .status(400)
      .json({ message: `ID de carrito o producto inválido: ${cid}, ${pid}` });
  }

  try {
    // Buscar el carrito por su ID (ObjectId o UUID)
    let cart;
    if (mongoose.Types.ObjectId.isValid(cid)) {
      cart = await CartModel.findById(cid); // Buscar por ObjectId
    } else {
      cart = await CartModel.findOne({ uuid: cid }); // Buscar por UUID (si tienes un campo 'uuid' en el modelo)
    }

    if (!cart) {
      return res
        .status(404)
        .json({ message: `Carrito con ID ${cid} no encontrado` });
    }

    // Verificar si el producto ya existe en el carrito
    let productExists = cart.products.find((p) => p.product.toString() === pid);

    if (productExists) {
      productExists.quantity += 1; // Si ya existe, incrementar la cantidad
    } else {
      cart.products.push({ product: pid, quantity: 1 }); // Si no existe, agregarlo con cantidad 1
    }

    await cart.save(); // Guardar el carrito actualizado

    res.status(201).json({
      message: `Producto con ID ${pid} agregado al carrito con ID ${cid}`,
      data: cart,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al agregar el producto al carrito", error });
  }
});
