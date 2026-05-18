import express from "express";
import Product from "../models/product.js";

const router = express.Router();

// OBTENER PRODUCTOS
router.get("/products", async (req, res) => {

    try {

        const products = await Product.find();

        res.json({
            success: true,
            products
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error obteniendo productos"
        });
    }
});

export default router;