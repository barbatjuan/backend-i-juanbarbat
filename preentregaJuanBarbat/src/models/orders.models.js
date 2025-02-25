import mongoose from "mongoose";

const orderCollection = "orders";

const orderSchema = new mongoose.Schema(
  {
    customer_name: {
      type: String,
      required: true,
      index: true,
    },
    pets: [
      {
        pet: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "pets", // Referencia a las mascotas
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    total_price: {
      type: Number,
      required: true,
    },
    order_status: {
      type: String,
      enum: ["pending", "completed", "shipped", "cancelled"],
      default: "pending",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Para registrar las fechas de creación y actualización
    versionKey: false, // No agregar la propiedad __v
  }
);

export const OrderModel = mongoose.model(orderCollection, orderSchema);
