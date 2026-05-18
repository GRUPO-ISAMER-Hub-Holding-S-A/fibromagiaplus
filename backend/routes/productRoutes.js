import express from "express";
import Product from "../models/product.js";

const router = express.Router();

router.get("/productos", async (req, res) => {

    try {

        const productos = await Product.find();

        res.json(productos);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error obteniendo productos"
        });
    }
});

export default router;