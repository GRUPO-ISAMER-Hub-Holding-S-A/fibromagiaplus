import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true
    },

    precio: {
        type: Number,
        required: true
    },

    stock: {
        type: Number,
        required: true,
        default: 0
    },

    img: {
        type: String
    }

});

export default mongoose.model("Product", productSchema);