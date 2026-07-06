import express from "express";
import { MercadoPagoConfig, Preference } from "mercadopago";
import Order from "../models/order.js";
import Product from "../models/product.js";

const router = express.Router();

const crearPago = async (req, res) => {

    try {

        const { items, cliente, envio } = req.body;

        const frontendUrl =
            process.env.FRONTEND_URL ||
            req.get("origin") ||
            "http://localhost:3000";

        if (!process.env.MP_ACCESS_TOKEN) {

            return res.status(500).json({
                success: false,
                message: "Falta configurar MP_ACCESS_TOKEN"
            });

        }

        if (!Array.isArray(items) || items.length === 0) {

            return res.status(400).json({
                success: false,
                message: "El carrito está vacío"
            });

        }

        const preferenceItems = [];
        const productosOrden = [];

        for (const item of items) {

            const productoDB = await Product.findById(item.productId);

            if (!productoDB) {

                return res.status(404).json({
                    success: false,
                    message: "Producto inexistente"
                });

            }

            if (productoDB.stock < item.cantidad) {

                return res.status(400).json({
                    success: false,
                    message: `Sin stock para ${productoDB.nombre}`
                });

            }

            preferenceItems.push({

                title: productoDB.nombre,

                quantity: Number(item.cantidad),

                unit_price: Number(productoDB.precio),

                currency_id: "ARS"

            });

            productosOrden.push({

                productId: productoDB._id,

                nombre: productoDB.nombre,

                precio: productoDB.precio,

                cantidad: Number(item.cantidad)

            });

        }

        const total = preferenceItems.reduce((acc, item) => {

            return acc + item.quantity * item.unit_price;

        }, 0);

        const client = new MercadoPagoConfig({

            accessToken: process.env.MP_ACCESS_TOKEN

        });

        const preference = new Preference(client);

        const nuevaOrden = await Order.create({

            cliente,

            envio,

            productos: productosOrden,

            total,

            estadoPago: "Pendiente",

            estadoEnvio: "Recibido"

        });

        const response = await preference.create({

            body: {

                external_reference: nuevaOrden._id.toString(),

                notification_url: process.env.MP_NOTIFICATION_URL,

                items: preferenceItems,

                back_urls: {

                    success: `${frontendUrl}/success.html`,

                    failure: `${frontendUrl}/index.html`,

                    pending: `${frontendUrl}/index.html`

                },

                auto_return: "approved"

            }

        });

        res.json({

            success: true,

            url: response.init_point

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Error creando el pago"

        });

    }

};

router.post("/crear-pago", crearPago);
router.post("/create-preference", crearPago);

export default router;