import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/product.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

await Product.deleteMany();

await Product.insertMany([

    {
        nombre: "Faja lumbar",
        precio: 20000,
        stock: 15,
        img: "./assets/imge/fajalumbar.jpeg"
    },

    {
        nombre: "Rodillera",
        precio: 12500,
        stock: 20,
        img: "./assets/imge/rodillera.jpg.jpeg"
    },

    {
        nombre: "Tobillera",
        precio: 18000,
        stock: 12,
        img: "./assets/imge/tobillera.jpg.jpeg"
    },

    {
        nombre: "Foam Roller",
        precio: 38000,
        stock: 8,
        img: "./assets/imge/foamroller.jpg.webp"
    },

    {
        nombre: "PACK Fibromagia",
        precio: 89000,
        stock: 5,
        img: "./assets/imge/pack2.png"
    }

]);

console.log("PRODUCTOS CARGADOS");

process.exit();