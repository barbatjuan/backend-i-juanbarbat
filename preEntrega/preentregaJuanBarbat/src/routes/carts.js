import { Router } from 'express';

export const CartsRouter = Router();

// Base de datos simulada (puedes reemplazarlo con tu lógica real más adelante)
let carts = []; // Arreglo para almacenar los carritos en memoria

// GET: Obtener todos los carritos
CartsRouter.get('/', (req, res) => {
  res.status(200).json({
    message: 'Lista de carritos',
    data: carts,
  });
});

// GET: Obtener un carrito específico por ID
CartsRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  const cart = carts.find((cart) => cart.id === parseInt(id)); // Buscar carrito por ID

  if (cart) {
    res.status(200).json({
      message: `Carrito con ID ${id} encontrado`,
      data: cart,
    });
  } else {
    res.status(404).json({
      message: `Carrito con ID ${id} no encontrado`,
    });
  }
});

// POST: Crear un nuevo carrito
CartsRouter.post('/', (req, res) => {
  const { products } = req.body;

  if (!products || !Array.isArray(products)) {
    return res.status(400).json({
      message: 'El carrito debe incluir un array de productos',
    });
  }

  const newCart = {
    id: carts.length + 1, // Generar un ID único
    products, // Lista de productos del carrito
  };

  carts.push(newCart); // Agregar el carrito a la base de datos simulada

  res.status(201).json({
    message: 'Carrito creado con éxito',
    data: newCart,
  });
});
