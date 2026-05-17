import express from "express";
import { MercadoPagoConfig, Preference } from "mercadopago";

const router = express.Router();

const crearPago = async (req, res) => {

    try {
        const { items } = req.body;
        const frontendUrl = process.env.FRONTEND_URL || req.get("origin") || "http://localhost:3000";
        const notificationUrl = process.env.MP_NOTIFICATION_URL;

        if (!process.env.MP_ACCESS_TOKEN) {
            return res.status(500).json({
                success: false,
                message: "Falta configurar MP_ACCESS_TOKEN"
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "El carrito esta vacio"
            });
        }

        const preferenceItems = items.map((item) => ({
            title: String(item.nombre || "").trim(),
            quantity: Number(item.cantidad),
            unit_price: Number(item.precio),
            currency_id: "ARS"
        }));

        const invalidItem = preferenceItems.find((item) => (
            !item.title ||
            !Number.isFinite(item.quantity) ||
            item.quantity < 1 ||
            !Number.isFinite(item.unit_price) ||
            item.unit_price <= 0
        ));

        if (invalidItem) {
            return res.status(400).json({
                success: false,
                message: "Hay un producto invalido en el carrito"
            });
        }

        const client = new MercadoPagoConfig({
            accessToken: process.env.MP_ACCESS_TOKEN
        });

        const preference = new Preference(client);

        const response = await preference.create({
            body: {
                items: preferenceItems,
                back_urls: {
                    success: `${frontendUrl}/success.html`,
                    failure: `${frontendUrl}/index.html`,
                    pending: `${frontendUrl}/index.html`
                },
                ...(notificationUrl ? { notification_url: notificationUrl } : {})
            }
        });

        res.json({
            success: true,
            url: response.init_point
        });

    } catch (error) {

        console.error("Error creando pago:", error);

        res.status(500).json({
            success: false,
            message: "Error creando el pago"
        });
    }
};

router.post("/crear-pago", crearPago);
router.post("/create-preference", crearPago);

export default router;
