import Product from "../models/product.js";
import Order from "../models/order.js";

// ===============================
// PRODUCTOS
// ===============================

export const getProducts = async (req, res) => {

    try {

        const products = await Product.find().sort({ createdAt: -1 });

        res.json(products);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error obteniendo productos"
        });

    }

};

export const getProductById = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
            });

        }

        res.json(product);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error obteniendo producto"
        });

    }

};

export const createProduct = async (req, res) => {

    try {

        const product = await Product.create(req.body);

        res.status(201).json(product);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "No se pudo crear el producto"
        });

    }

};

export const updateProduct = async (req, res) => {

    try {

        const product = await Product.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                new: true
            }

        );

        res.json(product);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "No se pudo actualizar"
        });

    }

};

export const deleteProduct = async (req, res) => {

    try {

        await Product.findByIdAndDelete(req.params.id);

        res.json({
            success: true
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "No se pudo eliminar"
        });

    }

};

// ===============================
// PEDIDOS
// ===============================

export const getOrders = async (req, res) => {

    try {

        const orders = await Order.find().sort({

            createdAt: -1

        });

        res.json(orders);

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false

        });

    }

};

export const updateOrderStatus = async (req, res) => {

    try {

        const order = await Order.findByIdAndUpdate(

            req.params.id,

            {

                status: req.body.status

            },

            {

                new: true

            }

        );

        res.json(order);

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false

        });

    }

};

export const deleteOrder = async (req, res) => {

    try {

        await Order.findByIdAndDelete(req.params.id);

        res.json({

            success: true

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false

        });

    }

};