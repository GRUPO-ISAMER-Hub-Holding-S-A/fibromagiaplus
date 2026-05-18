import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    cliente: {
        nombre: String,
        email: String,
        telefono: String
    },

    envio: {
        provincia: String,
        ciudad: String,
        direccion: String,
        codigoPostal: String
    },

    items: [
        {
            nombre: String,
            cantidad: Number,
            precio: Number
        }
    ],

    total: Number,

    estado: {
        type: String,
        default: "pendiente"
    },

    mpPreferenceId: String,

    fecha: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Order", orderSchema);