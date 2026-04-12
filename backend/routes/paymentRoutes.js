import express from "express";
import mercadopago from "mercadopago";

const router = express.Router();

mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN
});

router.post("/crear-pago", async (req, res) => {

    const { items } = req.body;

    try {

        const preference = {
            items: items.map(p => ({
                title: p.nombre,
                unit_price: Number(p.precio),
                quantity: Number(p.cantidad),
                currency_id: "ARS"
            })),
            back_urls: {
                success: "http://localhost:5500/success.html",
                failure: "http://localhost:5500/fail.html",
                pending: "http://localhost:5500/pending.html"
            },
            auto_return: "approved",
            notification_url: "http://localhost:3000/api/webhook"
        };

        const response = await mercadopago.preferences.create(preference);

        res.json({ url: response.body.init_point });

    } catch (error) {
        console.error("ERROR MP:", error);
        res.status(500).json({ error: "Error creando pago" });
    }
});

export default router;