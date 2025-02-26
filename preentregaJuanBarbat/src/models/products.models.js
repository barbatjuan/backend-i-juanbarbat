import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    description: { type: String, required: true, index: true },
    code: {
      type: String,
      unique: true,
      required: true,
    },
    price: { type: Number, required: true, index: true },
    status: { type: Boolean, default: true }, //if not true, do not display
    stock: { type: Number, required: true },
    category: {
      type: String,
      enum: ["Gatos", "Perros"], //Enum de ejemplos
    },
    thumbnails: { required: false, type: [String], default: [] },
  },
  { timestamps: true, versionKey: false }
);

productSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model(productCollection, productSchema);
