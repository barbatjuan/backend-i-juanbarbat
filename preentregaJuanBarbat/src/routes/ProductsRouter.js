import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";

export const ProductsRouter = Router();
const productController = new ProductController();

// Obtener todos los productos con paginación
ProductsRouter.get("/", productController.getProducts);

// Crear un nuevo producto
ProductsRouter.post("/", productController.createProduct);

// Obtener un producto por ID
ProductsRouter.get("/:id", productController.getProductById);

// Actualizar un producto por ID
ProductsRouter.put("/:id", productController.updateProduct);

// Eliminar un producto por ID
ProductsRouter.delete("/:id", productController.deleteProduct);

export default ProductsRouter;
