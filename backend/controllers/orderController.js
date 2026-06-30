import Order from "../models/order.js";

// Obtener todas las órdenes
export const getOrders = async (req, res) => {

    try {

        const orders = await Order.find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error obteniendo órdenes"
        });

    }

};

// Cambiar estado
export const updateOrderStatus = async (req, res) => {

    try {

        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(

            id,

            {
                status
            },

            {
                new: true
            }

        );

        res.json({

            success: true,

            order

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Error actualizando orden"

        });

    }

};