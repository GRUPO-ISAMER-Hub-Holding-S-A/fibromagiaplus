import Product from "../models/product.js";
import Order from "../models/order.js";

// ===============================
// PRODUCTOS
// ===============================

export const getProducts = async (req, res) => {

    try {

        const products = await Product.find({ activo: true })
            .sort({
                createdAt: -1
            });

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

        const {
            nombre,
            descripcion,
            categoria,
            precio,
            stock,
            img
        } = req.body;

        const product = await Product.create({

            nombre,
            descripcion,
            categoria,

            precio: Number(precio),

            stock: Number(stock),

            img,

            activo: true

        });

        res.status(201).json({
            success: true,
            product
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Error creando producto"

        });

    }

};


export const updateProduct = async (req, res) => {

    try {

        const {

            nombre,
            descripcion,
            categoria,
            precio,
            stock,
            img,
            activo

        } = req.body;

        const product = await Product.findByIdAndUpdate(

            req.params.id,

            {

                nombre,
                descripcion,
                categoria,

                precio: Number(precio),

                stock: Number(stock),

                img,

                activo

            },

            {

                new: true,

                runValidators: true

            }

        );

        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Producto inexistente"

            });

        }

        res.json({

            success: true,

            product

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Error actualizando"

        });

    }

};

export const deleteProduct = async (req, res) => {

    try {

        await Product.findByIdAndUpdate(

            req.params.id,

            {

                activo: false

            }

        );

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

        console.log("BODY:", req.body);

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Pedido no encontrado"
            });
        }

        console.log("ANTES:", order.estadoEnvio);

        order.estadoEnvio = req.body.status;

        console.log("DESPUES:", order.estadoEnvio);

        await order.save();

        const actualizado = await Order.findById(req.params.id);

        console.log("MONGO:", actualizado.estadoEnvio);

        res.json(actualizado);

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