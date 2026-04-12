import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    numero: String,
    items: Array,
    total: Number,
    email: String,
    fecha: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Order", orderSchema);