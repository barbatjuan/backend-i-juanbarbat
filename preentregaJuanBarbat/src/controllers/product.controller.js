import { ProductModel } from "../models/products.models.js";

export class ProductController {
  constructor() {}

  // Obtener productos con paginación
  getProducts = async (req, res, next) => {
    try {
      let { limit, page, query, sort } = req.query;

      limit = parseInt(limit) || 5;
      page = parseInt(page) || 1;
      sort = sort ? { price: sort === "asc" ? 1 : -1 } : {};

      const filter = query ? { category: query } : {};

      const options = {
        page,
        limit,
        sort,
      };

      const products = await ProductModel.paginate(filter, options);

      res.status(200).json({
        message: "Productos obtenidos con éxito",
        data: products,
      });
    } catch (error) {
      next(error);
    }
  };

  // Crear un nuevo producto
  createProduct = async (req, res, next) => {
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

      if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
      }

      const product = new ProductModel({
        title,
        description,
        code,
        price,
        status: status ?? true,
        stock,
        category,
        thumbnails: thumbnails ?? [],
      });

      await product.save();
      res.status(201).json({ message: "Producto creado", data: product });
    } catch (error) {
      next(error);
    }
  };

  // Obtener un producto por ID
  getProductById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await ProductModel.findById(id);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Producto con ID ${id} no encontrado` });
      }

      res.status(200).json({ message: "Producto encontrado", data: product });
    } catch (error) {
      next(error);
    }
  };

  // Actualizar un producto por ID
  updateProduct = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );

      if (!updatedProduct) {
        return res
          .status(404)
          .json({ message: `Producto con ID ${id} no encontrado` });
      }

      res
        .status(200)
        .json({ message: "Producto actualizado", data: updatedProduct });
    } catch (error) {
      next(error);
    }
  };

  // Eliminar un producto por ID
  deleteProduct = async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedProduct = await ProductModel.findByIdAndDelete(id);

      if (!deletedProduct) {
        return res
          .status(404)
          .json({ message: `Producto con ID ${id} no encontrado` });
      }

      res.status(200).json({ message: "Producto eliminado" });
    } catch (error) {
      next(error);
    }
  };
}
