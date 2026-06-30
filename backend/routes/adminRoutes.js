import express from "express";

import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getOrders,
    updateOrderStatus
} from "../controllers/adminController.js";

const router = express.Router();

// ==========================
// PRODUCTOS
// ==========================

router.get("/products", getProducts);

router.post("/products", createProduct);

router.put("/products/:id", updateProduct);

router.delete("/products/:id", deleteProduct);

// ==========================
// PEDIDOS
// ==========================

router.get("/orders", getOrders);

router.put("/orders/:id/status", updateOrderStatus);

export default router;