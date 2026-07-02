import express from "express";
import upload from "../middlewares/uploads.js";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getOrders,
    deleteOrder,
    updateOrderStatus
} from "../controllers/adminController.js";

const router = express.Router();

// ==========================
// PRODUCTOS
// ==========================

router.get("/products", getProducts);

router.get("/products/:id", getProductById);

router.post("/products", createProduct);

router.put("/products/:id", updateProduct);

router.delete("/products/:id", deleteProduct);


router.post(

    "/uploads",

    upload.single("image"),

    (req, res) => {

        res.json({

            success: true,

            image: `/uploads/${req.file.filename}`

        });

    }

);


// ==========================
// PEDIDOS
// ==========================

router.get("/orders", getOrders);

router.put("/orders/:id/status", updateOrderStatus);

router.delete("/orders/:id", deleteOrder);

export default router;