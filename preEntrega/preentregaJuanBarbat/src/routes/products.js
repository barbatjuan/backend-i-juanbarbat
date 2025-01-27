import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import { config } from '../config/index.js'
import { v4 as uuidv4 } from 'uuid'
import { validateInputProducts } from '../middlewares/validationMiddleware.js'

export const ProductsRouter = Router()

const pathToProducts = path.join(config.dirname, '/src/data/products.json')

console.log(pathToProducts)
ProductsRouter.get('/', async (req, res) => {
  let productsString = await fs.promises.readFile(pathToProducts, 'utf-8')
  const products = JSON.parse(productsString)
  res.send({ products })
})

ProductsRouter.post('/', validateInputProducts, async (req, res) => {
  let productsString = await fs.promises.readFile(pathToProducts, 'utf-8')
  const products = JSON.parse(productsString)

  const id = uuidv4() // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body

  const product = {
    id,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  }

  products.push(product)

  const productsStringified = JSON.stringify(products, null, '\t')
  await fs.promises.writeFile(pathToProducts, productsStringified)
  res.send({ message: 'Producto creado', data: product })
})

ProductsRouter.get('/:id', async (req, res) => {
  const { id } = req.params; 

  let productsString = await fs.promises.readFile(pathToProducts, 'utf-8');
  const products = JSON.parse(productsString);

  const product = products.find((product) => product.id === id);

  if (product) {
    res.status(200).json({
      message: `Producto con ID ${id} encontrado`,
      data: product,
    });
  } else {
    res.status(404).json({
      message: `Producto con ID ${id} no encontrado`,
    });
  }
});

ProductsRouter.put('/:id', async (req, res) => {
  const { id } = req.params; 
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body; 

  if (req.body.id && req.body.id !== id) {
    return res.status(400).json({
      message: `No se puede modificar el ID del producto`,
    });
  }

  let productsString = await fs.promises.readFile(pathToProducts, 'utf-8');
  const products = JSON.parse(productsString);

  const productIndex = products.findIndex((product) => product.id === id);

  if (productIndex === -1) {
    return res.status(404).json({
      message: `Producto con ID ${id} no encontrado`,
    });
  }

  
  const updatedProduct = {
    ...products[productIndex], 
    ...(title !== undefined && { title }), 
    ...(description !== undefined && { description }),
    ...(code !== undefined && { code }),
    ...(price !== undefined && { price }),
    ...(status !== undefined && { status }), 
    ...(stock !== undefined && { stock }),
    ...(category !== undefined && { category }),
    ...(thumbnails !== undefined && { thumbnails }),
  };

  products[productIndex] = updatedProduct;

  const productsStringified = JSON.stringify(products, null, '\t');
  await fs.promises.writeFile(pathToProducts, productsStringified);

  res.status(200).json({
    message: `Producto con ID ${id} actualizado con éxito`,
    data: updatedProduct,
  });
});

ProductsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  let productsString = await fs.promises.readFile(pathToProducts, 'utf-8');
  let products = JSON.parse(productsString);

  const productIndex = products.findIndex((product) => product.id === id);

  if (productIndex === -1) {
    return res.status(404).json({
      message: `Producto con ID ${id} no encontrado`,
    });
  }

  products.splice(productIndex, 1);

  const productsStringified = JSON.stringify(products, null, '\t');
  await fs.promises.writeFile(pathToProducts, productsStringified);

  res.status(200).json({
    message: `Producto con ID ${id} eliminado`,
  });
});


