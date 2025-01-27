import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { config } from '../config/index.js';

export const CartsRouter = Router();

// Ruta para la base de datos de carritos
const pathToCarts = path.join(config.dirname, '/src/data/carts.json');

// GET: Obtener todos los carritos
CartsRouter.get('/', async (req, res) => {
  let cartsString = await fs.promises.readFile(pathToCarts, 'utf-8');
  const carts = JSON.parse(cartsString);
  res.status(200).json({
    message: 'Lista de carritos',
    data: carts,
  });
});

// GET: Obtener un carrito específico por ID
CartsRouter.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  let cartsString = await fs.promises.readFile(pathToCarts, 'utf-8');
  const carts = JSON.parse(cartsString);

  const cart = carts.find((cart) => cart.id === cid); // Buscar carrito por ID

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
});

// POST: Crear un nuevo carrito
CartsRouter.post('/', async (req, res) => {
  let cartsString = await fs.promises.readFile(pathToCarts, 'utf-8');
  const carts = JSON.parse(cartsString);

  const newCart = {
    id: uuidv4(), // Generar un ID único
    products: [],  // Carrito vacío inicialmente
  };

  carts.push(newCart); // Agregar el carrito a la base de datos simulada

  const cartsStringified = JSON.stringify(carts, null, '\t');
  await fs.promises.writeFile(pathToCarts, cartsStringified);

  res.status(201).json({
    message: 'Carrito creado con éxito',
    data: newCart,
  });
});

// POST: Agregar un producto al carrito
CartsRouter.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  // Verificar que el carrito exista
  let cartsString = await fs.promises.readFile(pathToCarts, 'utf-8');
  const carts = JSON.parse(cartsString);

  const cart = carts.find((cart) => cart.id === cid); // Buscar carrito por ID

  if (!cart) {
    return res.status(404).json({
      message: `Carrito con ID ${cid} no encontrado`,
    });
  }

  // Verificar que el producto no esté ya en el carrito
  const productExists = cart.products.find((product) => product.id === pid);

  if (productExists) {
    // Si el producto ya existe, solo aumentar la cantidad
    productExists.quantity += 1;
  } else {
    // Si el producto no existe, agregarlo al carrito
    cart.products.push({ id: pid, quantity: 1 });
  }

  const cartsStringified = JSON.stringify(carts, null, '\t');
  await fs.promises.writeFile(pathToCarts, cartsStringified);

  res.status(201).json({
    message: `Producto con ID ${pid} agregado al carrito con ID ${cid}`,
    data: cart,
  });
});
