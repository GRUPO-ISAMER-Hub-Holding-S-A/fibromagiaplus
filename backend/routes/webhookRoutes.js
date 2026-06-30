import express from "express";
import { MercadoPagoConfig, Payment } from "mercadopago";

import Order from "../models/order.js";
import Product from "../models/product.js";
import { enviarMail } from "../services/mailer.js";


const router = express.Router();

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

router.post("/webhook", async (req, res) => {

    try {

        if (req.query.type !== "payment") {
            return res.sendStatus(200);
        }

        const paymentId = req.query["data.id"];

        if (!paymentId) {
            return res.sendStatus(200);
        }

        const payment = new Payment(client);

        const pago = await payment.get({
            id: paymentId
        });

        if (pago.status !== "approved") {
            return res.sendStatus(200);
        }

        const order = await Order.findById(
            pago.external_reference
        );

        if (!order) {
            return res.sendStatus(200);
        }

        if (order.estadoPago === "Pagado") {
            return res.sendStatus(200);
        }

        order.estadoPago = "Pagado";
        order.paymentId = pago.id;
        order.estadoEnvio = "Recibido";

        await order.save();

        for (const item of order.productos) {

            await Product.findOneAndUpdate(
                {
                    nombre: item.nombre
                },
                {
                    $inc: {
                        stock: -item.cantidad
                    }
                }
            );

        }

        await enviarMail(order);

        console.log("✅ Pago confirmado:", order._id);

        res.sendStatus(200);

    } catch (error) {

        console.error(error);

        res.sendStatus(500);

    }

});

export default router;