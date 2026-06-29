import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    cliente: {

        nombre: String,
        apellido: String,
        email: String,
        telefono: String

    },

    envio: {

        provincia: String,
        ciudad: String,
        calle: String,
        altura: String,
        piso: String,
        departamento: String,
        codigoPostal: String,
        referencia: String

    },

    productos: [

        {

            productoId: String,

            nombre: String,

            cantidad: Number,

            precio: Number

        }

    ],

    total: {

        type: Number,
        required: true

    },

    paymentId: {

        type: String,
        default: ""

    },

    preferenceId: {

        type: String,
        default: ""

    },

    estadoPago: {

        type: String,

        default: "Pendiente"

    },

    estadoEnvio: {

        type: String,

        default: "Recibido"

    }

}, {

    timestamps: true

});

export default mongoose.model("Order", orderSchema);