import express from "express";
import { MercadoPagoConfig, Payment } from "mercadopago";

import Order from "../models/order.js";
import Product from "../models/product.js";
import { enviarMail } from "../services/mailer.js";

const router = express.Router();

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

router.post("/", async (req, res) => {

    try {

        const paymentId =
            req.query["data.id"] ||
            req.body?.data?.id;

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
            return res.sendStatus(404);
        }

        // Evita ejecutar dos veces
        if (order.estadoPago === "Pagado") {
            return res.sendStatus(200);
        }

        order.estadoPago = "Pagado";
        order.paymentId = pago.id;
        order.preferenceId = pago.order?.id || "";

        await order.save();

        for (const item of order.productos) {

            await Product.findByIdAndUpdate(
                item.productId,
                {
                    $inc: {
                        stock: -item.cantidad
                    }
                }
            );

        }

        try {

            await enviarMail(order);

        } catch (mailError) {

            console.log("Mail no enviado:", mailError.message);

        }

        console.log("Pago aprobado:", order._id);

        res.sendStatus(200);

    } catch (error) {

        console.error(error);

        res.sendStatus(500);

    }

});

export default router;