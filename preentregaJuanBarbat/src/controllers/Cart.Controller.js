import mongoose from "mongoose";
import { CartModel } from "../models/carts.models.js";

// Función para validar ID de MongoDB o UUID
function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id) || /^[0-9a-fA-F-]{36}$/.test(id);
}

// Obtener todos los carritos
export const getAllCarts = async (req, res) => {
  try {
    const carts = await CartModel.find();
    res.status(200).json({
      message: "Lista de carritos",
      data: carts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los carritos", error });
  }
};

// Obtener un carrito por ID (ObjectId o UUID)
export const getCartById = async (req, res) => {
  const { cid } = req.params;

  if (!isValidId(cid)) {
    return res.status(400).json({ message: `ID de carrito inválido: ${cid}` });
  }

  try {
    let cart;
    if (mongoose.Types.ObjectId.isValid(cid)) {
      cart = await CartModel.findById(cid);
    } else {
      cart = await CartModel.findOne({ uuid: cid });
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
};

// Crear un nuevo carrito
export const createCart = async (req, res) => {
  try {
    const newCart = new CartModel({
      customer_id: req.body.customer_id || null,
      products: [],
    });

    await newCart.save();

    res.status(201).json({
      message: "Carrito creado con éxito",
      data: newCart,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el carrito", error });
  }
};

// Agregar un producto a un carrito existente
export const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;

  if (!isValidId(cid) || !isValidId(pid)) {
    return res
      .status(400)
      .json({ message: `ID de carrito o producto inválido: ${cid}, ${pid}` });
  }

  try {
    let cart;
    if (mongoose.Types.ObjectId.isValid(cid)) {
      cart = await CartModel.findById(cid);
    } else {
      cart = await CartModel.findOne({ uuid: cid });
    }

    if (!cart) {
      return res
        .status(404)
        .json({ message: `Carrito con ID ${cid} no encontrado` });
    }

    let productExists = cart.products.find((p) => p.product.toString() === pid);

    if (productExists) {
      productExists.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();

    res.status(201).json({
      message: `Producto con ID ${pid} agregado al carrito con ID ${cid}`,
      data: cart,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al agregar el producto al carrito", error });
  }
};
