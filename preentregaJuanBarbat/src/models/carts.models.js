import mongoose from "mongoose";

const cartsCollections = "carts";

const cartSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
          },
          quantity: {
            type: Number,
            default: 1,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true, versionKey: false }
);

// Pre-populate en la consulta de 'find' y 'findOne'
cartSchema.pre("find", function () {
  this.populate("products.product");
});
cartSchema.pre("findOne", function () {
  this.populate("products.product");
});

export const CartModel = mongoose.model(cartsCollections, cartSchema);
