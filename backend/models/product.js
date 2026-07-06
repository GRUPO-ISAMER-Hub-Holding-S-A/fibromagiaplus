import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
{
    nombre:{
        type:String,
        required:true,
        trim:true
    },

    descripcion:{
        type:String,
        required:true,
        trim:true
    },

    categoria:{
        type:String,
        required:true,
        trim:true
    },

    precio:{
        type:Number,
        required:true,
        min:0
    },

    stock:{
        type:Number,
        required:true,
        default:0,
        min:0
    },

    img:{
        type:String,
        default:""
    },

    activo:{
        type:Boolean,
        default:true
    }

},
{
    timestamps:true
});

export default mongoose.model("Product",productSchema);