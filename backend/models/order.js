import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
{

    cliente:{
        nombre:String,
        apellido:String,
        email:String,
        telefono:String
    },

    envio:{
        provincia:String,
        ciudad:String,
        calle:String,
        altura:String,
        piso:String,
        departamento:String,
        codigoPostal:String,
        referencia:String
    },

    productos:[
        {

            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"
            },

            nombre:String,

            precio:Number,

            cantidad:Number

        }
    ],

    total:{
        type:Number,
        required:true
    },

    estadoPago:{
        type:String,
        enum:[
            "Pendiente",
            "Pagado",
            "Rechazado"
        ],
        default:"Pendiente"
    },

    estadoEnvio:{
        type:String,
        enum:[
            "Recibido",
            "Preparando",
            "En camino",
            "Entregado",
            "Cancelado"
        ],
        default:"Recibido"
    },

    paymentId:String,

    preferenceId:String

},
{
    timestamps:true
});

export default mongoose.model("Order",orderSchema);