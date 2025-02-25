import { Router } from "express";
import fs from "fs";
import path from "path";
import { config } from "../config/index.js";
import { v4 as uuidv4 } from "uuid";

export const ProductsRouter = Router();

const pathToProducts = path.join(config.dirname, "src/data/products.json");

console.log(pathToProducts);

ProductsRouter.get("/", async (req, res) => {
  try {
    const productsString = await fs.promises.readFile(pathToProducts, "utf-8");
    const products = JSON.parse(productsString);
    res.send({ products });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos", error });
  }
});

ProductsRouter.post("/", async (req, res) => {
  try {
    const productsString = await fs.promises.readFile(pathToProducts, "utf-8");
    const products = JSON.parse(productsString);

    const id = uuidv4();

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

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const product = {
      id,
      title,
      description,
      code,
      price,
      status: status ?? true,
      stock,
      category,
      thumbnails: thumbnails ?? [],
    };

    products.push(product);

    await fs.promises.writeFile(
      pathToProducts,
      JSON.stringify(products, null, "\t")
    );

    res.status(201).json({ message: "Producto creado", data: product });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el producto", error });
  }
});

ProductsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const productsString = await fs.promises.readFile(pathToProducts, "utf-8");
    const products = JSON.parse(productsString);

    const product = products.find((product) => product.id === id);

    if (product) {
      res.status(200).json({ message: `Producto encontrado`, data: product });
    } else {
      res.status(404).json({ message: `Producto con ID ${id} no encontrado` });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al buscar el producto", error });
  }
});

ProductsRouter.put("/:id", async (req, res) => {
  try {
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
        message: "No se puede modificar el ID del producto",
      });
    }

    const productsString = await fs.promises.readFile(pathToProducts, "utf-8");
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

    await fs.promises.writeFile(
      pathToProducts,
      JSON.stringify(products, null, "\t")
    );

    res.status(200).json({
      message: `Producto actualizado`,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el producto", error });
  }
});

ProductsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const productsString = await fs.promises.readFile(pathToProducts, "utf-8");
    let products = JSON.parse(productsString);

    const productIndex = products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      return res.status(404).json({
        message: `Producto con ID ${id} no encontrado`,
      });
    }

    products.splice(productIndex, 1);

    await fs.promises.writeFile(
      pathToProducts,
      JSON.stringify(products, null, "\t")
    );

    res.status(200).json({ message: `Producto eliminado` });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el producto", error });
  }
});

export default ProductsRouter;
