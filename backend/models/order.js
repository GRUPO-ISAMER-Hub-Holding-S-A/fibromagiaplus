import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    numero: {
        type: String,
        unique: true
    },

    cliente: {

        nombre: {
            type: String,
            required: true
        },

        apellido: {
            type: String,
            default: ""
        },

        email: {
            type: String,
            required: true
        },

        telefono: {
            type: String,
            required: true
        }

    },

    envio: {

        provincia: String,

        ciudad: String,

        direccion: String,

        altura: String,

        casa: String,

        departamento: String,

        codigoPostal: String,

        entreCalles: String,

        descripcion: String

    },

    items: [

        {

            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },

            nombre: String,

            cantidad: Number,

            precio: Number,

            subtotal: Number

        }

    ],

    total: {
        type: Number,
        required: true
    },

    estado: {

        type: String,

        enum: [
            "pendiente",
            "pagado",
            "preparando",
            "enviado",
            "entregado",
            "cancelado"
        ],

        default: "pendiente"

    },

    paymentId: String,

    preferenceId: String,

    externalReference: String,

    fecha: {

        type: Date,

        default: Date.now

    }

},
{
    timestamps: true
});

orderSchema.pre("save", function(next){

    if(!this.numero){

        this.numero =
            "FBM-" +
            Date.now() +
            "-" +
            Math.floor(Math.random()*1000);

    }

    next();

});

export default mongoose.model(
    "Order",
    orderSchema
);