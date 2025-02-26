import { Router } from "express";
import { ProductModel } from "../models/products.models.js";

export const ProductsRouter = Router();

// Obtener todos los productos
ProductsRouter.get("/", async (req, res) => {
  try {
    const products = await ProductModel.find(); // Obtener todos los productos desde MongoDB
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos", error });
  }
});

// Crear un nuevo producto
ProductsRouter.post("/", async (req, res) => {
  try {
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

    // Validar campos obligatorios
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // Crear un nuevo producto
    const product = new ProductModel({
      title,
      description,
      code,
      price,
      status: status ?? true, // Por defecto, el producto está activo
      stock,
      category,
      thumbnails: thumbnails ?? [], // Por defecto, no hay imágenes
    });

    // Guardar el producto en MongoDB
    await product.save();

    res.status(201).json({ message: "Producto creado", data: product });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el producto", error });
  }
});

// Obtener un producto por ID
ProductsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el producto por su ID
    const product = await ProductModel.findById(id);

    if (product) {
      res.status(200).json({ message: "Producto encontrado", data: product });
    } else {
      res.status(404).json({ message: `Producto con ID ${id} no encontrado` });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al buscar el producto", error });
  }
});

// Actualizar un producto por ID
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

    // Buscar y actualizar el producto
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      },
      { new: true } // Devuelve el documento actualizado
    );

    if (updatedProduct) {
      res.status(200).json({
        message: "Producto actualizado",
        data: updatedProduct,
      });
    } else {
      res.status(404).json({ message: `Producto con ID ${id} no encontrado` });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el producto", error });
  }
});

// Eliminar un producto por ID
ProductsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar y eliminar el producto
    const deletedProduct = await ProductModel.findByIdAndDelete(id);

    if (deletedProduct) {
      res.status(200).json({ message: "Producto eliminado" });
    } else {
      res.status(404).json({ message: `Producto con ID ${id} no encontrado` });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el producto", error });
  }
});

export default ProductsRouter;
