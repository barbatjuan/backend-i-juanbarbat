import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { config } from '../config/index.js';

export const CartsRouter = Router();


const pathToCarts = path.join(config.dirname, '/src/data/carts.json');


CartsRouter.get('/', async (req, res) => {
  let cartsString = await fs.promises.readFile(pathToCarts, 'utf-8');
  const carts = JSON.parse(cartsString);
  res.status(200).json({
    message: 'Lista de carritos',
    data: carts,
  });
});


CartsRouter.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  let cartsString = await fs.promises.readFile(pathToCarts, 'utf-8');
  const carts = JSON.parse(cartsString);

  const cart = carts.find((cart) => cart.id === cid); 

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

CartsRouter.post('/', async (req, res) => {
  let cartsString = await fs.promises.readFile(pathToCarts, 'utf-8');
  const carts = JSON.parse(cartsString);

  const newCart = {
    id: uuidv4(),
    products: [],
  };

  carts.push(newCart); 

  const cartsStringified = JSON.stringify(carts, null, '\t');
  await fs.promises.writeFile(pathToCarts, cartsStringified);

  res.status(201).json({
    message: 'Carrito creado con éxito',
    data: newCart,
  });
});

CartsRouter.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  let cartsString = await fs.promises.readFile(pathToCarts, 'utf-8');
  const carts = JSON.parse(cartsString);

  const cart = carts.find((cart) => cart.id === cid); 

  if (!cart) {
    return res.status(404).json({
      message: `Carrito con ID ${cid} no encontrado`,
    });
  }

  const productExists = cart.products.find((product) => product.id === pid);

  if (productExists) {
    productExists.quantity += 1;
  } else {
    cart.products.push({ id: pid, quantity: 1 });
  }

  const cartsStringified = JSON.stringify(carts, null, '\t');
  await fs.promises.writeFile(pathToCarts, cartsStringified);

  res.status(201).json({
    message: `Producto con ID ${pid} agregado al carrito con ID ${cid}`,
    data: cart,
  });
});
